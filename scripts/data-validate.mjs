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
    required: ['category', 'item_key', 'item_label', 'description', 'law_reference', 'method', 'related_certificate', 'report_section', 'conditions'],
    uniqueField: 'item_key', // Field that should be unique
    types: {
      category: 'string',
      item_key: 'string',
      item_label: 'string',
      description: 'string',
      law_reference: 'string',
      method: 'string',
      related_certificate: 'string',
      report_section: 'string',
      conditions: 'string'
    },
    allowEmpty: ['conditions'] // Fields that can be empty
  },
  certificates_master: {
    file: 'Data/certificates_master.csv',
    required: ['cert_key', 'cert_name', 'applies_to_item', 'online', 'by_mail', 'by_counter', 'dept', 'url', 'notes'],
    uniqueField: 'cert_key',
    types: {
      cert_key: 'string',
      cert_name: 'string',
      applies_to_item: 'string',
      online: 'string',
      by_mail: 'string',
      by_counter: 'string',
      dept: 'string',
      url: 'string',
      notes: 'string'
    },
    allowEmpty: []
  },
  profile: {
    file: 'Data/profile.csv',
    required: ['氏名', '役割', '連絡先', '担当範囲', '備考'],
    uniqueField: null, // No unique field for profile
    types: {
      '氏名': 'string',
      '役割': 'string',
      '連絡先': 'string',
      '担当範囲': 'string',
      '備考': 'string'
    },
    allowEmpty: ['氏名', '役割', '連絡先', '担当範囲', '備考'] // Allow all to be empty
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
    
    // Check for duplicate IDs if uniqueField is specified
    if (schema.uniqueField && row[schema.uniqueField]) {
      if (ids.has(row[schema.uniqueField])) {
        errors.push(`Row ${rowNum}: Duplicate ID "${row[schema.uniqueField]}" in column "${schema.uniqueField}"`);
      }
      ids.add(row[schema.uniqueField]);
    }
    
    // Check for empty required values (unless allowed)
    schema.required.forEach(col => {
      if (headers.includes(col) && !row[col]) {
        const allowEmpty = schema.allowEmpty || [];
        if (!allowEmpty.includes(col)) {
          warnings.push(`Row ${rowNum}: Empty value in required column "${col}"`);
          emptyValueCount++;
        }
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
