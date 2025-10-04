import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseChecklistMaster, evaluateConditions, PropertyProfile } from '@/lib/checklist-parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, profile } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    // Fetch property to get its attributes
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Merge property data with profile
    const fullProfile: PropertyProfile = {
      kind: property.kind || profile?.kind,
      zone: property.zone || profile?.zone,
      ...profile,
    };

    // Parse master CSV
    const masterItems = parseChecklistMaster();

    // Filter items based on conditions
    const applicableItems = masterItems.filter(item => 
      evaluateConditions(item.conditions, fullProfile)
    );

    // Create checklist items
    const checklistItems = applicableItems.map(item => ({
      propertyId,
      category: item.category,
      itemKey: item.itemKey,
      itemLabel: item.itemLabel,
      description: item.description || null,
      lawReference: item.lawReference || null,
      method: item.method || null,
      relatedCert: item.relatedCertificate || null,
      reportSection: item.reportSection || null,
      isRequired: false, // Can be enhanced based on business logic
      isDone: false,
    }));

    // Delete existing items for this property and create new ones
    await prisma.checklistItem.deleteMany({
      where: { propertyId },
    });

    await prisma.checklistItem.createMany({
      data: checklistItems,
    });

    // Fetch the created items
    const createdItems = await prisma.checklistItem.findMany({
      where: { propertyId },
      orderBy: [
        { category: 'asc' },
        { itemKey: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      count: createdItems.length,
      items: createdItems,
    });
  } catch (error) {
    console.error('Error generating checklist:', error);
    return NextResponse.json(
      { error: 'Failed to generate checklist' },
      { status: 500 }
    );
  }
}
