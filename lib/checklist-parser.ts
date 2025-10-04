import fs from 'fs';
import path from 'path';

export interface ChecklistMasterItem {
  category: string;
  itemKey: string;
  itemLabel: string;
  description: string;
  lawReference: string;
  method: string;
  relatedCertificate: string;
  reportSection: string;
  conditions: string;
}

export function parseChecklistMaster(): ChecklistMasterItem[] {
  const csvPath = path.join(process.cwd(), 'Data', 'checklist_master.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  // Skip header line
  const items: ChecklistMasterItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const parts = line.split(',');
    if (parts.length >= 9) {
      items.push({
        category: parts[0].trim(),
        itemKey: parts[1].trim(),
        itemLabel: parts[2].trim(),
        description: parts[3].trim(),
        lawReference: parts[4].trim(),
        method: parts[5].trim(),
        relatedCertificate: parts[6].trim(),
        reportSection: parts[7].trim(),
        conditions: parts[8].trim(),
      });
    }
  }
  
  return items;
}

export interface PropertyProfile {
  kind?: string;
  zone?: string;
  [key: string]: string | undefined;
}

/**
 * Simple conditions parser
 * Supports: 
 * - kind=land
 * - kind!=land
 * - kind=land|house (OR)
 * - zone=市街化区域
 */
export function evaluateConditions(conditions: string, profile: PropertyProfile): boolean {
  if (!conditions || conditions.trim() === '') {
    return true; // No conditions means always applicable
  }
  
  const orParts = conditions.split('|');
  
  for (const orPart of orParts) {
    const trimmed = orPart.trim();
    
    // Check for != operator
    if (trimmed.includes('!=')) {
      const [key, value] = trimmed.split('!=').map(s => s.trim());
      if (profile[key] !== value) {
        return true; // At least one OR condition is met
      }
    }
    // Check for = operator
    else if (trimmed.includes('=')) {
      const [key, value] = trimmed.split('=').map(s => s.trim());
      if (profile[key] === value) {
        return true; // At least one OR condition is met
      }
    }
  }
  
  return false;
}
