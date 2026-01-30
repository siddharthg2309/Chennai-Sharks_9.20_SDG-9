# Phase 5: Bug Fixes & Enhanced AI Verification

## Overview
Fix issues from Phase 4:
1. **Explore Carousel** - Fix inconsistent card heights and scroll indicator
2. **Claim Credits** - Enhanced AI verification with OCR support for invoices
3. **Investments Page** - Center tabs and remove bottom border

**UI References:**
- Carousel Issue: `docs/images/image copy 14.png`
- Claim Credits: `docs/images/image copy 15.png`
- Investments Tabs: `docs/images/image copy 16.png` (if available)

---

## 5.1 Fix: Explore Carousel Component

### Issues:
- Cards have varying heights
- Scroll dots don't update when scrolling
- No snap scrolling behavior

### File: `src/components/home/ExploreCarousel.tsx` (Updated)

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Leaf, Building, TrendingUp } from 'lucide-react';

const categories = [
  {
    id: 'GREEN_FUND',
    title: 'Green Mutual Funds',
    description: 'ESG & renewable energy funds',
    icon: Leaf,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-500',
  },
  {
    id: 'GREEN_BOND',
    title: 'Green Bonds',
    description: 'Fixed return green bonds',
    icon: Building,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    id: 'INVIT',
    title: 'Green InvITs',
    description: 'Infrastructure trusts',
    icon: TrendingUp,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
  },
];

export function ExploreCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to update active dot
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.7; // 70% of container width
      const gap = 16; // gap-4 = 16px

      // Calculate which card is most visible
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, categories.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to specific card when dot is clicked
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth * 0.7;
    const gap = 16;
    const scrollPosition = index * (cardWidth + gap);

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4 px-4">Explore investment ideas</h2>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map(({ id, title, description, icon: Icon, iconBg, iconColor }) => (
          <Link
            key={id}
            href={`/discover?type=${id}`}
            className="snap-start flex-shrink-0"
            style={{ width: '70%' }} // Fixed width for all cards
          >
            <Card className="h-40 flex flex-col justify-between hover:bg-gray-800 transition-colors">
              <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === activeIndex ? 'bg-blue-500' : 'bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

### CSS Addition for scrollbar hiding

**File: `src/app/globals.css`** (Add these styles)

```css
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
```

---

## 5.2 Fix: Investments Page Tabs

### Issues:
- Tabs (Portfolio, SIPs, Orders) are left-aligned instead of centered
- Unnecessary bottom border line below tabs

### File: `src/app/investments/page.tsx` (Updated Tabs Section)

**Before:**
```typescript
{/* Tabs */}
<div className="flex gap-6 mb-6 border-b border-gray-800">
  {(['portfolio', 'sips', 'orders'] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-3 font-medium capitalize ${
        activeTab === tab
          ? 'text-white border-b-2 border-blue-500'
          : 'text-gray-500'
      }`}
    >
      {tab === 'sips' ? 'SIPs' : tab}
    </button>
  ))}
</div>
```

**After:**
```typescript
{/* Tabs - Centered without bottom border */}
<div className="flex justify-center gap-8 mb-6">
  {(['portfolio', 'sips', 'orders'] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-2 font-medium capitalize transition-colors ${
        activeTab === tab
          ? 'text-white border-b-2 border-blue-500'
          : 'text-gray-500 hover:text-gray-400'
      }`}
    >
      {tab === 'sips' ? 'SIPs' : tab}
    </button>
  ))}
</div>
```

### Full Updated Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

type Tab = 'portfolio' | 'sips' | 'orders';

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      const endpoint =
        activeTab === 'portfolio'
          ? '/api/portfolio'
          : activeTab === 'sips'
          ? '/api/sips'
          : '/api/orders';

      const res = await fetch(endpoint);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      {/* Tabs - Centered without bottom border */}
      <div className="flex justify-center gap-8 mb-6">
        {(['portfolio', 'sips', 'orders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            {tab === 'sips' ? 'SIPs' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : data.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="space-y-4">
          {activeTab === 'portfolio' && <PortfolioList holdings={data} />}
          {activeTab === 'sips' && <SipsList sips={data} onUpdate={fetchData} />}
          {activeTab === 'orders' && <OrdersList orders={data} />}
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Briefcase className="w-16 h-16 text-blue-500 mb-4" />
      <p className="text-lg mb-2">
        {tab === 'portfolio'
          ? "You don't have any investments"
          : tab === 'sips'
          ? "You don't have any SIPs"
          : 'No orders yet'}
      </p>
      <Link href="/discover" className="text-blue-500">
        {tab === 'portfolio' ? 'Invest now' : 'Explore funds'}
      </Link>
    </div>
  );
}

function PortfolioList({ holdings }: { holdings: any[] }) {
  return (
    <>
      {holdings.map((item) => (
        <Card key={item.id}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{item.fund.name}</h3>
              <p className="text-sm text-gray-500">
                {item.quantity} units @ {formatCurrency(item.avgBuyPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(item.currentValue)}</p>
              <p
                className={`text-sm ${
                  parseFloat(item.pnl) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(item.pnl)} ({formatPercent(parseFloat(item.pnlPercent))})
              </p>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

function SipsList({ sips, onUpdate }: { sips: any[]; onUpdate: () => void }) {
  const handleStatusChange = async (sipId: string, newStatus: string) => {
    try {
      await fetch(`/api/sips/${sipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating SIP:', error);
    }
  };

  return (
    <>
      {sips.map(({ sip, fund }) => (
        <Card key={sip.id}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium">{fund.name}</h3>
              <p className="text-sm text-gray-500">
                {formatCurrency(sip.installmentAmount)} / {sip.frequency.toLowerCase()}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                sip.status === 'ACTIVE'
                  ? 'bg-green-500/20 text-green-500'
                  : sip.status === 'PAUSED'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {sip.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Next: {new Date(sip.nextExecutionDate).toLocaleDateString('en-IN')}
          </p>
          {sip.status === 'ACTIVE' && (
            <button
              onClick={() => handleStatusChange(sip.id, 'PAUSED')}
              className="text-sm text-yellow-500"
            >
              Pause SIP
            </button>
          )}
          {sip.status === 'PAUSED' && (
            <button
              onClick={() => handleStatusChange(sip.id, 'ACTIVE')}
              className="text-sm text-green-500"
            >
              Resume SIP
            </button>
          )}
        </Card>
      ))}
    </>
  );
}

function OrdersList({ orders }: { orders: any[] }) {
  return (
    <>
      {orders.map(({ order, fund }) => (
        <Card key={order.id}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{fund.name}</h3>
              <p className="text-sm text-gray-500">
                {order.type} • {formatCurrency(order.amount)}
              </p>
              <p className="text-xs text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                order.status === 'COMPLETED'
                  ? 'bg-green-500/20 text-green-500'
                  : order.status === 'PENDING'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {order.status}
            </span>
          </div>
          {order.greenCreditsEarned && parseFloat(order.greenCreditsEarned) > 0 && (
            <p className="text-xs text-green-500 mt-2">
              +{formatCurrency(order.greenCreditsEarned)} Green Credits earned
            </p>
          )}
        </Card>
      ))}
    </>
  );
}
```

### Changes Made:
| Before | After |
|--------|-------|
| `flex gap-6` | `flex justify-center gap-8` |
| `border-b border-gray-800` | Removed |
| `pb-3` | `pb-2` |
| No hover state | Added `hover:text-gray-400` |

---

## 5.3 Fix: Enhanced Claim Credits with OCR

### New Dependencies

```bash
npm install pdf-parse tesseract.js
```

### Flow Logic:

```
┌─────────────────────────────────────────────────────────┐
│                    User Submits Claim                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Is file uploaded?      │
              └─────────────────────────┘
                     │           │
                    YES          NO
                     │           │
                     ▼           │
         ┌───────────────────┐   │
         │  Extract text     │   │
         │  using OCR        │   │
         └───────────────────┘   │
                     │           │
                     ▼           ▼
         ┌─────────────────────────────┐
         │   Send to AI Agent:         │
         │   - Product Name            │
         │   - Product Price           │
         │   - Invoice Text (if any)   │
         └─────────────────────────────┘
                     │
                     ▼
         ┌─────────────────────────────┐
         │   AI Verification Result    │
         └─────────────────────────────┘
                     │
           ┌─────────┴─────────┐
           │                   │
        SUCCESS             FAILURE
           │                   │
           ▼                   ▼
    ┌────────────┐     ┌────────────────┐
    │  Process   │     │   FALLBACK:    │
    │  Response  │     │  Approve claim │
    └────────────┘     │  & deduct all  │
                       │  credits       │
                       └────────────────┘
```

---

### File: `src/lib/ocr.ts` - OCR Utility

```typescript
import Tesseract from 'tesseract.js';

/**
 * Extract text from an image file using Tesseract OCR
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    // Convert File to base64 data URL
    const dataUrl = await fileToDataUrl(file);

    const result = await Tesseract.recognize(dataUrl, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return result.data.text;
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return '';
  }
}

/**
 * Extract text from a PDF file
 * Note: For server-side, use pdf-parse. For client-side, we'll convert to image first.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import for server-side only
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);

    return data.text;
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return '';
  }
}

/**
 * Extract text from any supported file type
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // Handle PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }

  // Handle image files
  if (fileType.startsWith('image/') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg')) {
    return extractTextFromImage(file);
  }

  // Unsupported file type
  console.warn('Unsupported file type for OCR:', fileType);
  return '';
}

/**
 * Convert File to base64 data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

---

### File: `src/lib/ai-agent.ts` (Updated with Enhanced Verification)

```typescript
// OpenRouter via direct fetch (no OpenAI SDK)
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// List of valid green/renewable product categories
const GREEN_CATEGORIES = [
  'solar panel',
  'solar water heater',
  'solar inverter',
  'solar battery',
  'electric vehicle',
  'ev',
  'e-bike',
  'electric scooter',
  'electric car',
  'electric motorcycle',
  'battery storage',
  'home battery',
  'powerwall',
  'wind turbine',
  'energy efficient appliance',
  'led lights',
  'led bulb',
  'smart thermostat',
  'insulation',
  'heat pump',
  'rainwater harvesting',
  'composting system',
  'bicycle',
  'e-bicycle',
  'public transport pass',
  'metro card',
  'bus pass',
  'ev charger',
  'charging station',
];

interface VerificationInput {
  productName: string;
  productPrice: number;
  userCredits: number;
  invoiceText?: string; // OCR extracted text from invoice
}

interface VerificationResult {
  isGreenProduct: boolean;
  reason: string;
  productCategory: string;
  confidence: 'high' | 'medium' | 'low';
  extractedDetails?: {
    detectedProductName?: string;
    detectedPrice?: number;
    sellerName?: string;
    invoiceDate?: string;
  };
}

/**
 * Verify if a product qualifies for green credit redemption
 * Supports both manual entry and OCR-extracted invoice data
 */
export async function verifyGreenProduct(
  input: VerificationInput
): Promise<VerificationResult> {
  const { productName, productPrice, userCredits, invoiceText } = input;

  // Build the system prompt based on whether invoice text is available
  const systemPrompt = buildSystemPrompt(!!invoiceText);
  const userPrompt = buildUserPrompt(productName, productPrice, userCredits, invoiceText);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_APP_NAME || 'GreenFin Investors PWA',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const result = JSON.parse(jsonMatch[0]) as VerificationResult;

    // Additional validation: check if product name contains green keywords
    const productLower = productName.toLowerCase();
    const hasGreenKeyword = GREEN_CATEGORIES.some(cat =>
      productLower.includes(cat.toLowerCase())
    );

    // If AI says not green but product has green keyword, trust the keyword
    if (!result.isGreenProduct && hasGreenKeyword) {
      result.isGreenProduct = true;
      result.reason = `Product "${productName}" matches green category`;
      result.confidence = 'medium';
    }

    return result;
  } catch (error) {
    console.error('AI verification error:', error);

    // Fallback: Simple keyword matching when AI fails
    return fallbackVerification(productName, productPrice);
  }
}

/**
 * Build system prompt for AI verification
 */
function buildSystemPrompt(hasInvoice: boolean): string {
  const basePrompt = `You are a green product verification assistant for GreenFin, a platform that rewards users with Green Credits for investing in renewable energy. Users can redeem these credits when purchasing green/eco-friendly products.

Your job is to determine if a product qualifies for green credit redemption.

## ELIGIBLE PRODUCTS (renewable energy or eco-friendly):
- Solar: panels, water heaters, inverters, batteries, rooftop systems
- Electric Vehicles: cars (Tata Nexon EV, MG ZS EV, etc.), e-bikes, e-scooters, e-rickshaws
- Energy Storage: home batteries, powerwalls, UPS with lithium batteries
- Energy Efficient: 5-star rated appliances, LED lighting systems, smart thermostats
- Sustainable Transport: bicycles, public transport passes, metro cards
- Green Infrastructure: EV chargers, rainwater harvesting systems, heat pumps

## NOT ELIGIBLE:
- Regular petrol/diesel vehicles
- Standard home appliances (non 5-star)
- Electronics (phones, laptops, TVs, gaming consoles)
- Clothing, furniture, food items
- Cosmetics, healthcare products
- Any non-environmental products

## VERIFICATION RULES:
1. Product must clearly be for renewable energy or sustainability
2. If product name is ambiguous, lean towards rejection
3. Check if the price is reasonable for the product type
4. Flag suspicious claims (e.g., solar panel for ₹500)`;

  const invoiceInstructions = hasInvoice
    ? `

## INVOICE VERIFICATION (OCR text provided):
- Cross-reference the provided product name with invoice details
- Extract seller name, invoice date if visible
- Verify the claimed price matches invoice amount
- Look for keywords indicating green/renewable products
- If invoice text is unclear, rely more on the stated product name`
    : `

## MANUAL VERIFICATION (no invoice provided):
- Rely solely on the product name provided
- Be slightly more cautious without invoice proof
- Check if the product name is specific enough`;

  return (
    basePrompt +
    invoiceInstructions +
    `

## RESPONSE FORMAT (JSON only):
{
  "isGreenProduct": boolean,
  "reason": "Clear explanation for the decision",
  "productCategory": "Category name (e.g., 'Electric Vehicle', 'Solar Panel') or 'Not Eligible'",
  "confidence": "high" | "medium" | "low",
  "extractedDetails": {
    "detectedProductName": "Product name from invoice (if applicable)",
    "detectedPrice": number or null,
    "sellerName": "Seller name from invoice (if applicable)",
    "invoiceDate": "Date from invoice (if applicable)"
  }
}

Respond with JSON only, no additional text.`
  );
}

/**
 * Build user prompt with all verification details
 */
function buildUserPrompt(
  productName: string,
  productPrice: number,
  userCredits: number,
  invoiceText?: string
): string {
  let prompt = `Please verify this green credit redemption claim:

## CLAIM DETAILS
- Product Name: ${productName}
- Claimed Price: ₹${productPrice.toLocaleString('en-IN')}
- User's Available Credits: ₹${userCredits.toLocaleString('en-IN')}`;

  if (invoiceText && invoiceText.trim().length > 0) {
    // Truncate invoice text if too long
    const truncatedText =
      invoiceText.length > 2000
        ? invoiceText.substring(0, 2000) + '... [truncated]'
        : invoiceText;

    prompt += `

## INVOICE TEXT (extracted via OCR):
\`\`\`
${truncatedText}
\`\`\``;
  } else {
    prompt += `

## NOTE: No invoice uploaded. Verify based on product name only.`;
  }

  prompt += `

Is this a valid green/renewable energy product eligible for credit redemption? Respond with JSON only.`;

  return prompt;
}

/**
 * Fallback verification using keyword matching
 * Used when AI service is unavailable
 */
function fallbackVerification(
  productName: string,
  productPrice: number
): VerificationResult {
  const productLower = productName.toLowerCase();

  // Check against green categories
  const matchedCategory = GREEN_CATEGORIES.find(cat =>
    productLower.includes(cat.toLowerCase())
  );

  if (matchedCategory) {
    return {
      isGreenProduct: true,
      reason: `Product matches green category: "${matchedCategory}"`,
      productCategory: capitalizeWords(matchedCategory),
      confidence: 'medium',
    };
  }

  // Additional keyword checks
  const greenKeywords = ['solar', 'electric', 'ev', 'renewable', 'eco', 'green', 'sustainable'];
  const hasGreenKeyword = greenKeywords.some(kw => productLower.includes(kw));

  if (hasGreenKeyword) {
    return {
      isGreenProduct: true,
      reason: `Product name contains green/eco-friendly keywords`,
      productCategory: 'Green Product',
      confidence: 'low',
    };
  }

  return {
    isGreenProduct: false,
    reason: 'Product does not match any green/renewable category',
    productCategory: 'Not Eligible',
    confidence: 'medium',
  };
}

/**
 * Helper to capitalize words
 */
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

---

### File: `src/app/api/green-credits/claim/route.ts` (Updated with OCR)

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, greenCreditClaims } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/mock-user';
import { verifyGreenProduct } from '@/lib/ai-agent';
import { extractTextFromFile } from '@/lib/ocr';

export async function POST(request: Request) {
  try {
    const userId = getCurrentUserId();
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const productName = formData.get('productName') as string;
    const productPrice = parseFloat(formData.get('productPrice') as string);

    // Validate required fields
    if (!productName || !productPrice || isNaN(productPrice)) {
      return NextResponse.json(
        { success: false, error: 'Product name and valid price are required' },
        { status: 400 }
      );
    }

    if (productPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Product price must be greater than 0' },
        { status: 400 }
      );
    }

    // Get user's current green credits
    const [user] = await db
      .select({ greenCredits: users.greenCredits })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const currentCredits = parseFloat(user.greenCredits || '0');

    if (currentCredits <= 0) {
      return NextResponse.json(
        { success: false, error: 'No green credits available to claim' },
        { status: 400 }
      );
    }

    // Extract text from invoice if file is uploaded
    let invoiceText: string | undefined;
    if (file && file.size > 0) {
      console.log(`Processing uploaded file: ${file.name} (${file.type})`);
      try {
        invoiceText = await extractTextFromFile(file);
        console.log(`Extracted ${invoiceText.length} characters from invoice`);
      } catch (ocrError) {
        console.error('OCR extraction failed:', ocrError);
        // Continue without invoice text - will verify based on product name only
      }
    }

    // Create pending claim record
    const [claim] = await db
      .insert(greenCreditClaims)
      .values({
        userId,
        productName,
        productPrice: productPrice.toString(),
        uploadedFileUrl: file ? `uploaded:${file.name}` : null,
        status: 'PENDING',
      })
      .returning();

    // Attempt AI verification
    let verificationResult;
    let isApproved = false;
    let creditsToRedeem = 0;
    let verificationMethod: 'ai' | 'fallback' = 'ai';

    try {
      console.log('Starting AI verification...');
      console.log(`- Product: ${productName}`);
      console.log(`- Price: ₹${productPrice}`);
      console.log(`- Has Invoice: ${!!invoiceText}`);

      verificationResult = await verifyGreenProduct({
        productName,
        productPrice,
        userCredits: currentCredits,
        invoiceText,
      });

      console.log('AI verification result:', verificationResult);

      isApproved = verificationResult.isGreenProduct;

      if (isApproved) {
        // Calculate credits to redeem (minimum of product price and available credits)
        creditsToRedeem = Math.min(productPrice, currentCredits);
      }
    } catch (aiError) {
      console.error('AI verification failed completely, using fallback:', aiError);

      // FALLBACK: If AI framework fails entirely, approve and redeem all available credits
      verificationMethod = 'fallback';
      isApproved = true;
      creditsToRedeem = currentCredits; // Redeem all available credits

      verificationResult = {
        isGreenProduct: true,
        reason: 'AI verification service unavailable - claim auto-approved as fallback',
        productCategory: 'Auto-Approved',
        confidence: 'low' as const,
      };

      console.log('Fallback applied: approving claim with all available credits');
    }

    // Update claim record with verification result
    await db
      .update(greenCreditClaims)
      .set({
        aiVerificationResult: JSON.stringify({
          ...verificationResult,
          verificationMethod,
          invoiceProvided: !!invoiceText,
          invoiceTextLength: invoiceText?.length || 0,
        }),
        isApproved,
        creditsRedeemed: creditsToRedeem.toString(),
        status: isApproved ? 'APPROVED' : 'REJECTED',
        processedAt: new Date(),
      })
      .where(eq(greenCreditClaims.id, claim.id));

    // If approved, deduct credits from user
    if (isApproved && creditsToRedeem > 0) {
      const newCredits = currentCredits - creditsToRedeem;

      await db
        .update(users)
        .set({
          greenCredits: newCredits.toString(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      console.log(`Credits deducted: ₹${creditsToRedeem}. New balance: ₹${newCredits}`);
    }

    // Build response message
    let message: string;
    if (isApproved) {
      if (verificationMethod === 'fallback') {
        message = `Claim approved (auto-approved). ₹${creditsToRedeem.toFixed(2)} credited to your account.`;
      } else {
        message = `Claim approved! ₹${creditsToRedeem.toFixed(2)} credited to your account for your ${verificationResult.productCategory || 'green product'} purchase.`;
      }
    } else {
      message = `Claim rejected: ${verificationResult?.reason || 'Product not eligible for green credits'}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        claimId: claim.id,
        isApproved,
        creditsRedeemed: creditsToRedeem,
        newBalance: isApproved ? currentCredits - creditsToRedeem : currentCredits,
        verificationResult: {
          ...verificationResult,
          method: verificationMethod,
          invoiceProcessed: !!invoiceText,
        },
        message,
      },
    });
  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process claim. Please try again.' },
      { status: 500 }
    );
  }
}
```

---

## 5.4 Updated Claim Credits Page UI

### File: `src/app/account/claim-credits/page.tsx` (Updated)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Leaf, CheckCircle, XCircle, FileText, Image, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export default function ClaimCreditsPage() {
  const [balance, setBalance] = useState(0);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const res = await fetch('/api/green-credits');
      const data = await res.json();
      if (data.success) {
        setBalance(data.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  const getFileIcon = () => {
    if (!file) return Upload;
    if (file.type === 'application/pdf') return FileText;
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!productName.trim()) {
      alert('Please enter the product name');
      return;
    }

    if (!productPrice || parseFloat(productPrice) <= 0) {
      alert('Please enter a valid product price');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Update loading message based on whether file is being processed
      if (file) {
        setLoadingMessage('Processing invoice...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX
        setLoadingMessage('Extracting text from invoice...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setLoadingMessage('Verifying with AI...');

      const formData = new FormData();
      formData.append('productName', productName.trim());
      formData.append('productPrice', productPrice);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/green-credits/claim', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
        setBalance(data.data.newBalance);
        // Clear form on success
        if (data.data.isApproved) {
          setProductName('');
          setProductPrice('');
          setFile(null);
        }
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      setResult({ error: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }

  const FileIcon = getFileIcon();

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/account" className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Claim Green Credits</h1>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-3xl font-bold text-green-500">
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </Card>

      {/* How it works */}
      <Card className="mb-6 bg-gray-900/50">
        <h3 className="font-medium mb-3">How it works</h3>
        <ol className="text-sm text-gray-400 space-y-2">
          <li className="flex gap-2">
            <span className="text-blue-500 font-medium">1.</span>
            Enter details of your green/renewable energy purchase
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-medium">2.</span>
            Upload invoice or receipt (optional, but helps verification)
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-medium">3.</span>
            Our AI verifies if the product is eligible
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-medium">4.</span>
            If approved, credits are converted to cash
          </li>
        </ol>
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-500">
            <span className="text-green-500 font-medium">Eligible products:</span> Solar panels, EVs, e-bikes, home batteries, EV chargers, LED systems, etc.
          </p>
        </div>
      </Card>

      {/* Claim Form */}
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Tata Nexon EV, Solar Panel 5kW"
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1">
              Be specific - include brand and model if possible
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Product Price (₹) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter amount"
              min="1"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Upload Invoice (Optional)
            </label>
            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
              file ? 'border-green-600 bg-green-900/20' : 'border-gray-700 hover:border-gray-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <FileIcon className={`w-8 h-8 ${file ? 'text-green-500' : 'text-gray-500'}`} />
              <span className={`text-sm ${file ? 'text-green-400' : 'text-gray-500'}`}>
                {file ? file.name : 'Click to upload PDF or Image'}
              </span>
              {file && (
                <span className="text-xs text-gray-600">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Supported: PDF, PNG, JPG (invoice helps verify your claim faster)
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || balance <= 0 || !productName.trim() || !productPrice}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingMessage || 'Processing...'}
              </span>
            ) : (
              'Submit Claim'
            )}
          </Button>

          {balance <= 0 && (
            <p className="text-sm text-red-500 text-center">
              You don't have any green credits to claim
            </p>
          )}
        </form>
      ) : (
        <ResultCard result={result} onReset={() => setResult(null)} />
      )}
    </div>
  );
}

function ResultCard({ result, onReset }: { result: any; onReset: () => void }) {
  if (result.error) {
    return (
      <Card className="text-center py-8 bg-red-900/20 border-red-800">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-500 mb-2">Error</h3>
        <p className="text-gray-400 mb-4">{result.error}</p>
        <Button onClick={onReset} variant="secondary">
          Try Again
        </Button>
      </Card>
    );
  }

  const isApproved = result.isApproved;

  return (
    <Card
      className={`text-center py-8 ${
        isApproved ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'
      }`}
    >
      {isApproved ? (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-500 mb-2">Claim Approved!</h3>
          <p className="text-gray-400 mb-4">{result.message}</p>
          <div className="bg-black/30 rounded-lg p-4 inline-block mb-4">
            <p className="text-sm text-gray-400">Amount Credited</p>
            <p className="text-3xl font-bold text-green-500">
              {formatCurrency(result.creditsRedeemed)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            New balance: {formatCurrency(result.newBalance)}
          </p>
          {result.verificationResult?.productCategory && (
            <p className="text-xs text-gray-600">
              Category: {result.verificationResult.productCategory}
            </p>
          )}
          {result.verificationResult?.method === 'fallback' && (
            <p className="text-xs text-yellow-500 mt-2">
              Note: Auto-approved due to verification service unavailability
            </p>
          )}
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-500 mb-2">Claim Rejected</h3>
          <p className="text-gray-400 mb-4">{result.message}</p>
          {result.verificationResult?.reason && (
            <p className="text-sm text-gray-500 mb-4">
              Reason: {result.verificationResult.reason}
            </p>
          )}
          <p className="text-xs text-gray-600">
            Try submitting with a clearer product name or upload an invoice for better verification.
          </p>
        </>
      )}

      <Button onClick={onReset} variant="secondary" className="mt-6">
        {isApproved ? 'Submit Another Claim' : 'Try Again'}
      </Button>
    </Card>
  );
}
```

---

## 5.5 Summary of Changes

### Carousel Fixes:
| Issue | Fix |
|-------|-----|
| Inconsistent card heights | Fixed height `h-40` on all cards |
| Dots don't change color | Added scroll event listener to track active index |
| No snap scrolling | Added `snap-x snap-mandatory` and `snap-start` classes |
| Dots not clickable | Added `scrollToCard()` function for dot navigation |

### Investments Page Tabs Fix:
| Issue | Fix |
|-------|-----|
| Tabs left-aligned | Added `justify-center` to center tabs |
| Bottom border line | Removed `border-b border-gray-800` |
| No hover state | Added `hover:text-gray-400` for inactive tabs |

### Claim Credits Enhancements:
| Feature | Implementation |
|---------|----------------|
| No file verification | Send product name + price to AI agent |
| PDF invoice | Use `pdf-parse` to extract text, send to AI |
| Image invoice | Use `tesseract.js` OCR to extract text, send to AI |
| AI failure fallback | Auto-approve and deduct all available credits |
| Better prompts | Detailed system prompt with eligible/ineligible categories |
| Invoice cross-reference | AI checks if invoice matches claimed product |

---

## Phase 5 Checklist

- [ ] Install new dependencies (`pdf-parse`, `tesseract.js`)
- [ ] Update `ExploreCarousel.tsx` with scroll tracking
- [ ] Add scrollbar-hide CSS to globals.css
- [ ] Update `InvestmentsPage` tabs to be centered
- [ ] Remove bottom border from investments tabs
- [ ] Create `src/lib/ocr.ts` utility
- [ ] Update `src/lib/ai-agent.ts` with enhanced verification
- [ ] Update `/api/green-credits/claim/route.ts` with OCR
- [ ] Update claim credits page UI with loading states
- [ ] Test carousel scroll indicator
- [ ] Test investments page tabs alignment
- [ ] Test claim without invoice
- [ ] Test claim with PDF invoice
- [ ] Test claim with image invoice
- [ ] Test AI fallback scenario

---

## Testing Scenarios

### Carousel Testing:
1. Scroll carousel - dots should update
2. Click dots - should scroll to corresponding card
3. All cards should have same height

### Investments Page Testing:
1. Tabs should be centered horizontally
2. No bottom border line below tabs
3. Active tab should have blue underline
4. Inactive tabs should show hover effect
5. Switching tabs should load correct content

### Claim Credits Testing:

| Scenario | Input | Expected Result |
|----------|-------|-----------------|
| Valid green product (no invoice) | "Tata Nexon EV", ₹15,00,000 | Approved |
| Valid product with PDF invoice | Upload PDF with EV details | Approved |
| Valid product with image invoice | Upload image of solar panel bill | Approved |
| Invalid product | "iPhone 15", ₹80,000 | Rejected |
| AI service down | Any product | Auto-approved (fallback) |
| Zero credits | Any product | Error: No credits available |
