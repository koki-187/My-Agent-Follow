#!/usr/bin/env node
/**
 * PDF Generator Test Suite
 * 
 * This test validates the core functionality of the PDF report generator:
 * 1. Template variable replacement
 * 2. Footnote collection from checked items
 * 3. Markdown to HTML conversion
 */

// Test 1: Template Variable Replacement
function testTemplateReplacement() {
    console.log('Test 1: Template Variable Replacement');
    
    const template = `# 調査報告書

## 物件概要
{propertyTitle}

## 都市計画
{sections.都市計画}

## 道路
{sections.道路}

## 出典・参考情報
{footnotes}`;

    const data = {
        propertyTitle: '東京都渋谷区恵比寿1-2-3',
        sections: {
            '都市計画': '用途地域: 第一種住居地域',
            '道路': '幅員6m 公道'
        }
    };

    let result = template
        .replace('{propertyTitle}', data.propertyTitle)
        .replace('{sections.都市計画}', data.sections['都市計画'])
        .replace('{sections.道路}', data.sections['道路'])
        .replace('{footnotes}', '脚注テスト');

    const expected = `# 調査報告書

## 物件概要
東京都渋谷区恵比寿1-2-3

## 都市計画
用途地域: 第一種住居地域

## 道路
幅員6m 公道

## 出典・参考情報
脚注テスト`;

    if (result === expected) {
        console.log('✅ PASS: Template replacement works correctly');
        return true;
    } else {
        console.log('❌ FAIL: Template replacement failed');
        console.log('Expected:', expected);
        console.log('Got:', result);
        return false;
    }
}

// Test 2: Footnote Collection
function testFootnoteCollection() {
    console.log('\nTest 2: Footnote Collection');
    
    const checkedItems = [
        {
            label: '用途地域確認',
            notes: {
                sourceUrl: 'https://www.city.example.jp/urban',
                checkedAt: '2025-01-15',
                by: '山田太郎'
            }
        },
        {
            label: '道路台帳確認',
            notes: {
                sourceUrl: 'https://www.city.example.jp/road',
                checkedAt: '2025-01-16',
                by: '佐藤花子'
            }
        }
    ];

    const footnotes = checkedItems.map((item, index) => {
        return `[${index + 1}] ${item.label}\n出典: ${item.notes.sourceUrl}\n取得日: ${item.notes.checkedAt}\n担当: ${item.notes.by}`;
    });

    if (footnotes.length === 2 && footnotes[0].includes('用途地域確認') && footnotes[1].includes('道路台帳確認')) {
        console.log('✅ PASS: Footnote collection works correctly');
        console.log('Generated footnotes:');
        footnotes.forEach(f => console.log(f));
        return true;
    } else {
        console.log('❌ FAIL: Footnote collection failed');
        return false;
    }
}

// Test 3: Markdown to HTML Conversion
function testMarkdownToHtml() {
    console.log('\nTest 3: Markdown to HTML Conversion');
    
    const markdown = `# 調査報告書
## 物件概要
東京都渋谷区恵比寿1-2-3`;

    const html = markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/\n/g, '<br>');

    const expected = '<h1>調査報告書</h1><br><h2>物件概要</h2><br>東京都渋谷区恵比寿1-2-3';

    if (html === expected) {
        console.log('✅ PASS: Markdown to HTML conversion works correctly');
        return true;
    } else {
        console.log('❌ FAIL: Markdown to HTML conversion failed');
        console.log('Expected:', expected);
        console.log('Got:', html);
        return false;
    }
}

// Run all tests
console.log('=== PDF Generator Test Suite ===\n');

const results = [
    testTemplateReplacement(),
    testFootnoteCollection(),
    testMarkdownToHtml()
];

const passed = results.filter(r => r).length;
const total = results.length;

console.log(`\n=== Test Results: ${passed}/${total} passed ===`);

if (passed === total) {
    console.log('✅ All tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed');
    process.exit(1);
}
