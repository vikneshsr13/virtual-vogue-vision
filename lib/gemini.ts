import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set. AI features will have limited functionality.');
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Error initializing Gemini:', error);
    return null;
  }
};

export async function generateTags(description: string, imageUrl?: string): Promise<string[]> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      const fallbackTags = [];
      const desc = description.toLowerCase();
      if (desc.includes('summer') || desc.includes('warm')) fallbackTags.push('warm weather');
      if (desc.includes('winter') || desc.includes('cold')) fallbackTags.push('cool weather');
      if (desc.includes('sleeve')) fallbackTags.push('long sleeved');
      if (desc.includes('formal') || desc.includes('business')) fallbackTags.push('formal', 'work');
      if (desc.includes('party') || desc.includes('evening')) fallbackTags.push('party', 'evening');
      if (desc.includes('casual')) fallbackTags.push('casual');
      return fallbackTags.length > 0 ? fallbackTags : ['clothing', 'fashion'];
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze this clothing item description and generate relevant tags. 
    Description: ${description}
    
    Generate tags like: weather-appropriate (e.g., "cool weather", "warm weather"), 
    sleeve type (e.g., "long sleeved", "sleeveless"), style (e.g., "casual", "formal", "party"), 
    occasion (e.g., "work", "evening", "beach"), and other relevant fashion tags.
    
    Return only a JSON array of tag strings, no other text. Example: ["cool weather", "long sleeved", "casual", "work"]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const tags = JSON.parse(text);
      return Array.isArray(tags) ? tags : [];
    } catch {
      const tagMatches = text.match(/\[(.*?)\]/);
      if (tagMatches) {
        const tags = JSON.parse(tagMatches[0]);
        return Array.isArray(tags) ? tags : [];
      }
      return [];
    }
  } catch (error) {
    console.error('Error generating tags:', error);
    return ['clothing', 'fashion'];
  }
}

export async function analyzeMood(imageBase64?: string, userInput?: string): Promise<{
  mood: string;
  energy: string;
  impression: string;
  recommendations: string[];
}> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      const input = (userInput || '').toLowerCase();
      let mood = 'neutral';
      let energy = 'medium';
      let impression = 'casual';
      let recommendations = ['versatile dresses', 'comfortable clothing'];
      
      if (input.includes('happy') || input.includes('excited') || input.includes('celebrate')) {
        mood = 'happy';
        energy = 'high';
        impression = 'vibrant';
        recommendations = ['colorful party dresses', 'statement pieces', 'bold accessories'];
      } else if (input.includes('sad') || input.includes('down') || input.includes('tired')) {
        mood = 'calm';
        energy = 'low';
        impression = 'comfortable';
        recommendations = ['soft, comfortable dresses', 'cozy styles', 'relaxed fits'];
      } else if (input.includes('professional') || input.includes('work') || input.includes('business')) {
        mood = 'focused';
        energy = 'medium';
        impression = 'professional';
        recommendations = ['business dresses', 'tailored pieces', 'classic styles'];
      } else if (input.includes('bold') || input.includes('confident') || input.includes('power')) {
        mood = 'confident';
        energy = 'high';
        impression = 'bold';
        recommendations = ['statement dresses', 'bold colors', 'structured silhouettes'];
      } else if (input.includes('cute') || input.includes('sweet') || input.includes('feminine')) {
        mood = 'playful';
        energy = 'medium';
        impression = 'cute';
        recommendations = ['floral dresses', 'pastel colors', 'feminine styles'];
      }
      
      return { mood, energy, impression, recommendations };
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a fashion psychologist analyzing a user's mood and fashion needs.

User input: "${userInput || 'No specific input provided'}"

Analyze the user's emotional state, energy level, and desired impression. Then provide personalized fashion recommendations.

IMPORTANT: Your response must be DIFFERENT for each unique input. Do not give generic responses.

Analyze:
1. Current mood (be specific: happy, excited, calm, confident, playful, elegant, etc. - choose based on the input)
2. Energy level (high, medium, low - based on the input context)
3. Desired impression (professional, cute, bold, luxury, aesthetic, comfortable, etc. - infer from input)
4. Product recommendations (3-5 specific, unique clothing items/styles that match the mood and impression)

Return ONLY a valid JSON object with this exact structure:
{
  "mood": "specific mood based on input",
  "energy": "high/medium/low",
  "impression": "desired impression",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}

Do not include any text before or after the JSON. Make sure each analysis is unique and tailored to the specific input.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.mood && parsed.energy && parsed.impression && Array.isArray(parsed.recommendations)) {
          return parsed;
        }
      }
    } catch (parseError) {
      console.error('Error parsing mood analysis:', parseError);
    }
    
    const input = (userInput || '').toLowerCase();
    if (input.includes('happy') || input.includes('excited')) {
      return {
        mood: 'happy',
        energy: 'high',
        impression: 'vibrant',
        recommendations: ['colorful party dresses', 'statement pieces', 'bold accessories']
      };
    } else if (input.includes('professional') || input.includes('work')) {
      return {
        mood: 'focused',
        energy: 'medium',
        impression: 'professional',
        recommendations: ['business dresses', 'tailored pieces', 'classic styles']
      };
    }
    
    return {
      mood: 'neutral',
      energy: 'medium',
      impression: 'casual',
      recommendations: ['versatile dresses', 'comfortable clothing', 'everyday styles']
    };
  } catch (error: any) {
    console.error('Error analyzing mood:', error);
    const input = (userInput || '').toLowerCase();
    if (input.includes('happy') || input.includes('excited')) {
      return {
        mood: 'happy',
        energy: 'high',
        impression: 'vibrant',
        recommendations: ['colorful dresses', 'party wear', 'bold styles']
      };
    }
    return {
      mood: 'neutral',
      energy: 'medium',
      impression: 'casual',
      recommendations: ['casual wear', 'comfortable clothing']
    };
  }
}

export async function chatWithAssistant(userMessage: string, context?: any): Promise<string> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      return 'I apologize, but the AI assistant requires a Gemini API key to be configured. Please add GEMINI_API_KEY to your environment variables. In the meantime, feel free to browse our collection of beautiful dresses!';
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Get available products for context
    const productsContext = context?.availableProducts ? `
    Available products in our store:
    ${context.availableProducts.map((p: any) => `- ${p.title}: ${p.description} ($${p.price})`).join('\n')}
    ` : '';
    
    const contextPrompt = context ? `
    User context:
    - Wardrobe items: ${context.wardrobeCount || 0}
    - Recent purchases: ${context.recentPurchases?.join(', ') || 'none'}
    - Style preferences: ${context.stylePreferences?.join(', ') || 'not specified'}
    ${productsContext}
    ` : '';
    
    const prompt = `${contextPrompt}
    
    You are a professional fashion stylist and shopping assistant for Virtual Vogue Vision, an AI-powered fashion e-commerce platform. 

    IMPORTANT INSTRUCTIONS:
    1. You MUST answer the user's specific question directly and helpfully
    2. Do NOT give generic responses - be specific and actionable
    3. If asked about products, recommend specific items from our collection
    4. If asked about sizes, provide helpful sizing advice
    5. If asked about styles, give specific style recommendations
    6. Be conversational, friendly, and professional
    7. Keep responses concise (2-4 sentences) but informative
    8. Always provide actionable advice
    
    User message: "${userMessage}"
    
    Provide a helpful, specific response that directly addresses the user's question. Do not give generic or repetitive answers.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      return 'I apologize, but I could not generate a response. Please try rephrasing your question.';
    }
    
    return text.trim();
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return 'I apologize, but there seems to be an issue with the API configuration. Please check your Gemini API key.';
    }
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return 'I apologize, but the AI service has reached its usage limit. Please try again later or contact support.';
    }
    if (error.message?.includes('safety')) {
      return 'I apologize, but your message was filtered by safety settings. Please try rephrasing your question.';
    }
    return 'I apologize, but I encountered an error processing your request. Please try rephrasing your question or try again in a moment.';
  }
}

export async function generateOutfit(wardrobeItems: any[], occasion?: string, style?: string): Promise<{
  outfit: string[];
  description: string;
  compatibilityScore: number;
}> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      return {
        outfit: wardrobeItems.slice(0, 3).map((item: any) => item.title),
        description: 'A stylish combination of your wardrobe items',
        compatibilityScore: 75
      };
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const itemsList = wardrobeItems.map((item: any) => 
      `${item.title} (${item.color || 'various'} ${item.category || 'item'})`
    ).join(', ');
    
    const prompt = `You are a fashion stylist creating an outfit from a user's wardrobe.

User's wardrobe items: ${itemsList}
Occasion: ${occasion || 'everyday'}
Desired style: ${style || 'versatile'}

Create a complete outfit by selecting 3-5 items from the wardrobe that work well together. Consider:
- Color coordination
- Style harmony
- Occasion appropriateness
- Overall aesthetic

Return a JSON object with:
{
  "outfit": ["item name 1", "item name 2", "item name 3"],
  "description": "Brief description of why these items work together",
  "compatibilityScore": 85
}

The compatibilityScore should be 0-100 based on how well the items match.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.outfit && Array.isArray(parsed.outfit)) {
          return parsed;
        }
      }
    } catch {}
    
    return {
      outfit: wardrobeItems.slice(0, 3).map((item: any) => item.title),
      description: 'A stylish combination selected from your wardrobe',
      compatibilityScore: 75
    };
  } catch (error) {
    console.error('Error generating outfit:', error);
    return {
      outfit: wardrobeItems.slice(0, 3).map((item: any) => item.title),
      description: 'A stylish combination from your wardrobe',
      compatibilityScore: 70
    };
  }
}

export async function calculateCompatibility(item1: any, item2: any): Promise<number> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      // Simple fallback compatibility
      if (item1.color === item2.color) return 85;
      if (item1.category === item2.category) return 70;
      return 60;
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Rate how well these two fashion items match together (0-100):

Item 1: ${item1.title} - Color: ${item1.color || 'N/A'}, Category: ${item1.category || 'N/A'}
Item 2: ${item2.title} - Color: ${item2.color || 'N/A'}, Category: ${item2.category || 'N/A'}

Consider: color harmony, style compatibility, occasion matching, overall aesthetic.

Return ONLY a number between 0-100, no other text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const score = parseInt(text.match(/\d+/)?.[0] || '70');
    return Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    if (item1.color === item2.color) return 85;
    if (item1.category === item2.category) return 70;
    return 60;
  }
}

export async function generateStyleProfile(answers: Record<number, string>): Promise<{
  styleType: string;
  description: string;
  recommendations: string[];
  colorPalette: string[];
  brands: string[];
}> {
  try {
    const genAI = getGenAI();
    
    const answerCounts: Record<string, number> = {};
    Object.values(answers).forEach(answer => {
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    });
    
    const dominantAnswer = Object.entries(answerCounts).sort(([,a], [,b]) => b - a)[0]?.[0];
    
    const styleMap: Record<string, any> = {
      'a': {
        styleType: 'Bold & Trendy',
        description: 'You love to stand out and embrace the latest trends. Your style is confident, vibrant, and always ahead of the curve.',
        recommendations: ['Statement pieces', 'Bold colors', 'Trendy accessories', 'Unique designs'],
        colorPalette: ['Electric blue', 'Hot pink', 'Lime green', 'Orange', 'Purple'],
        brands: ['Zara', 'ASOS', 'Forever 21', 'H&M Trend'],
      },
      'b': {
        styleType: 'Sustainable Minimalist',
        description: 'You value quality over quantity and prefer timeless, eco-friendly pieces. Your style is clean, conscious, and effortlessly elegant.',
        recommendations: ['Neutral colors', 'Quality basics', 'Sustainable materials', 'Versatile pieces'],
        colorPalette: ['Beige', 'Olive green', 'Terracotta', 'Navy', 'Cream'],
        brands: ['Everlane', 'Reformation', 'Patagonia', 'Eileen Fisher'],
      },
      'c': {
        styleType: 'Classic Professional',
        description: 'You prefer polished, sophisticated looks that never go out of style. Your wardrobe is built on timeless pieces and impeccable tailoring.',
        recommendations: ['Tailored suits', 'Classic dresses', 'Quality accessories', 'Neutral palette'],
        colorPalette: ['Black', 'White', 'Navy', 'Gray', 'Beige'],
        brands: ['Ann Taylor', 'J.Crew', 'Banana Republic', 'Theory'],
      },
      'd': {
        styleType: 'Artistic & Eclectic',
        description: 'You have a unique sense of style that blends vintage, artistic, and bohemian elements. Your look is creative and one-of-a-kind.',
        recommendations: ['Vintage finds', 'Artistic prints', 'Unique accessories', 'Mixed patterns'],
        colorPalette: ['Pastel pink', 'Lavender', 'Sage green', 'Mustard', 'Coral'],
        brands: ['Free People', 'Anthropologie', 'Urban Outfitters', 'Vintage shops'],
      },
    };

    if (genAI && dominantAnswer) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Based on these quiz answers, determine the user's fashion style profile:
${JSON.stringify(answers)}

Provide a detailed style profile with:
- styleType: A creative name for their style (e.g., "Bold Trendsetter", "Eco-Conscious Minimalist")
- description: A personalized description of their style personality
- recommendations: 4-5 specific style recommendations
- colorPalette: 5 colors that match their style
- brands: 4 brands that align with their style

Return ONLY a JSON object with these exact keys.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.styleType) {
            return parsed;
          }
        }
      } catch {}
    }

    return styleMap[dominantAnswer] || styleMap['b'];
  } catch (error) {
    console.error('Error generating style profile:', error);
    return {
      styleType: 'Versatile Classic',
      description: 'You have a versatile style that adapts to any occasion.',
      recommendations: ['Mix and match pieces', 'Neutral basics', 'Statement accessories'],
      colorPalette: ['Black', 'White', 'Navy', 'Beige', 'Gray'],
      brands: ['Zara', 'H&M', 'Mango', 'COS'],
    };
  }
}

export async function analyzeTrends(): Promise<any[]> {
  try {
    const genAI = getGenAI();
    if (!genAI) {
      return [
        {
          title: 'Sustainable Fashion',
          description: 'Eco-friendly and sustainable fashion choices are trending',
          category: 'Sustainability',
          colorPalette: ['Green', 'Beige', 'Natural tones'],
          season: 'All',
          popularity: 85
        },
        {
          title: 'Minimalist Elegance',
          description: 'Clean lines and simple designs are in style',
          category: 'Style',
          colorPalette: ['Black', 'White', 'Navy'],
          season: 'All',
          popularity: 75
        }
      ];
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a fashion trend analyst. Based on current global fashion trends from social media, fashion blogs, Reddit discussions, and Google Trends data, analyze and provide:

    1. Emerging style trends (what's new and popular)
    2. Popular color palettes (colors that are trending)
    3. Upcoming seasonal fashion (what's coming next)
    4. Popular outfit combinations (what people are wearing together)
    5. Influencer-driven trends (what celebrities and influencers are wearing)
    6. Street style trends (what's popular in urban fashion)
    
    Consider data from:
    - Reddit fashion communities (r/femalefashionadvice, r/malefashionadvice, r/streetwear)
    - Google Trends fashion searches
    - Social media platforms (Instagram, TikTok fashion content)
    - Fashion blogs and magazines
    - Runway shows and fashion weeks
    
    Return a JSON array of trend objects. Each object should have:
    - title: string (trend name)
    - description: string (detailed description of the trend)
    - category: string (e.g., "Color", "Style", "Accessories", "Seasonal")
    - colorPalette: array of strings (relevant colors for this trend)
    - season: string (Spring, Summer, Fall, Winter, or All)
    - popularity: number (0-100, how popular this trend is)
    
    Provide 8-10 current fashion trends. Make them realistic and based on actual current fashion movements.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const trends = JSON.parse(jsonMatch[0]);
        if (Array.isArray(trends) && trends.length > 0) {
          return trends;
        }
      }
      
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (parseError) {
      console.error('Error parsing trends JSON:', parseError);
    }
    
    return [
      {
        title: 'Sustainable Fashion Movement',
        description: 'Eco-conscious fashion choices are dominating the market. Consumers are prioritizing sustainable materials, ethical production, and circular fashion.',
        category: 'Sustainability',
        colorPalette: ['Earth tones', 'Natural beige', 'Olive green', 'Terracotta'],
        season: 'All',
        popularity: 90
      },
      {
        title: 'Y2K Fashion Revival',
        description: 'Early 2000s fashion is making a major comeback with low-rise jeans, butterfly clips, and colorful accessories.',
        category: 'Style',
        colorPalette: ['Pink', 'Baby blue', 'Lavender', 'Silver'],
        season: 'Spring/Summer',
        popularity: 85
      },
      {
        title: 'Minimalist Aesthetic',
        description: 'Clean lines, neutral colors, and timeless pieces are trending. Less is more philosophy in fashion.',
        category: 'Style',
        colorPalette: ['Black', 'White', 'Navy', 'Beige'],
        season: 'All',
        popularity: 80
      },
      {
        title: 'Bold Color Blocking',
        description: 'Vibrant color combinations and geometric patterns are in. Mixing unexpected colors for statement looks.',
        category: 'Color',
        colorPalette: ['Electric blue', 'Hot pink', 'Lime green', 'Orange'],
        season: 'Spring/Summer',
        popularity: 75
      },
      {
        title: 'Cottagecore & Romantic',
        description: 'Flowy dresses, floral patterns, and vintage-inspired pieces. Embracing feminine, romantic aesthetics.',
        category: 'Style',
        colorPalette: ['Pastel pink', 'Lavender', 'Sage green', 'Cream'],
        season: 'Spring/Summer',
        popularity: 78
      }
    ];
  } catch (error: any) {
    console.error('Error analyzing trends:', error);
    return [
      {
        title: 'Sustainable Fashion',
        description: 'Eco-friendly and sustainable fashion choices are trending',
        category: 'Sustainability',
        colorPalette: ['Green', 'Beige', 'Natural tones'],
        season: 'All',
        popularity: 85
      },
      {
        title: 'Minimalist Elegance',
        description: 'Clean lines and simple designs are in style',
        category: 'Style',
        colorPalette: ['Black', 'White', 'Navy'],
        season: 'All',
        popularity: 75
      }
    ];
  }
}
