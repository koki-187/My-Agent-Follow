#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// CSV schemas
const schemas = {
  checklist_master: {
    file: 'Data/checklist_master.csv',
    required: ['id', 'category', 'title', 'required', 'method', 'conditions'],
    types: {
      id: 'string',
      category: 'string',
      title: 'string',
      required: 'boolean',
      method: 'string',
      conditions: 'string'
    }
  },
  certificates_master: {
    file: 'Data/certificates_master.csv',
    required: ['id', 'name', 'method', 'dept', 'eta_days', 'fee', 'link'],
    types: {
      id: 'string',
      name: 'string',
      method: 'string',
      dept: 'string',
      eta_days: 'number',
      fee: 'number',
      link: 'string'
    }
  },
  profile: {
    file: 'Data/profile.csv',
    required: ['key', 'label', 'type', 'required', 'options'],
    types: {
      key: 'string',
      label: 'string',
      type: 'string',
      required: 'boolean',
      options: 'string'
    }
  }
};

// Parse CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });
  
  return { headers, rows };
}

// Validate value type
function validateType(value, type) {
  if (value === '') return true; // Allow empty values for optional fields
  
  switch (type) {
    case 'boolean':
      return value === 'true' || value === 'false';
    case 'number':
      return !isNaN(Number(value)) && value !== '';
    case 'string':
      return typeof value === 'string';
    default:
      return true;
  }
}

// Validate CSV file
function validateCSV(name, schema) {
  const filePath = join(rootDir, schema.file);
  const errors = [];
  const warnings = [];
  
  console.log(`\n📋 Validating ${schema.file}...`);
  
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    errors.push(`Cannot read file: ${err.message}`);
    return { errors, warnings, stats: null };
  }
  
  const { headers, rows } = parseCSV(content);
  
  // Check required columns
  const missingColumns = schema.required.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  // Validate rows
  const ids = new Set();
  let emptyValueCount = 0;
  let typeErrorCount = 0;
  
  rows.forEach((row, index) => {
    const rowNum = index + 2; // +2 because of 0-index and header row
    
    // Check for duplicate IDs
    const idField = schema.required[0]; // First column is ID
    if (row[idField]) {
      if (ids.has(row[idField])) {
        errors.push(`Row ${rowNum}: Duplicate ID "${row[idField]}"`);
      }
      ids.add(row[idField]);
    }
    
    // Check for empty required values
    schema.required.forEach(col => {
      if (headers.includes(col) && !row[col]) {
        warnings.push(`Row ${rowNum}: Empty value in required column "${col}"`);
        emptyValueCount++;
      }
    });
    
    // Check types
    Object.entries(schema.types).forEach(([col, type]) => {
      if (headers.includes(col) && row[col]) {
        if (!validateType(row[col], type)) {
          errors.push(`Row ${rowNum}: Invalid ${type} value in column "${col}": "${row[col]}"`);
          typeErrorCount++;
        }
      }
    });
  });
  
  const stats = {
    file: schema.file,
    totalRows: rows.length,
    uniqueIds: ids.size,
    emptyValues: emptyValueCount,
    typeErrors: typeErrorCount
  };
  
  return { errors, warnings, stats };
}

// Main validation
function main() {
  console.log('🔍 Starting CSV Data Validation...\n');
  
  let hasErrors = false;
  const allStats = [];
  
  Object.entries(schemas).forEach(([name, schema]) => {
    const { errors, warnings, stats } = validateCSV(name, schema);
    
    if (stats) {
      allStats.push(stats);
    }
    
    if (errors.length > 0) {
      hasErrors = true;
      console.error('❌ Errors:');
      errors.forEach(err => console.error(`  - ${err}`));
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️  Warnings:');
      warnings.forEach(warn => console.warn(`  - ${warn}`));
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ All checks passed!');
    }
  });
  
  // Print summary statistics
  console.log('\n📊 Validation Statistics:');
  console.log('═'.repeat(60));
  
  allStats.forEach(stat => {
    console.log(`\n${stat.file}:`);
    console.log(`  Total rows: ${stat.totalRows}`);
    console.log(`  Unique IDs: ${stat.uniqueIds}`);
    console.log(`  Empty values: ${stat.emptyValues}`);
    console.log(`  Type errors: ${stat.typeErrors}`);
  });
  
  console.log('\n' + '═'.repeat(60));
  
  if (hasErrors) {
    console.error('\n❌ Validation failed with errors!');
    process.exit(1);
  } else {
    console.log('\n✅ All CSV files validated successfully!');
    process.exit(0);
  }
}

main();
