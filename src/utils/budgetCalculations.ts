import { WeddingParameters, ExpenseCategory, AISuggestion, ExpenseItem } from '../types/wedding';

// Standard industry breakdown percentages for wedding planning
export const CATEGORY_PERCENTAGES: Record<ExpenseCategory, number> = {
  venue: 0.32,              // 32%
  food_catering: 0.22,      // 22%
  decoration: 0.14,         // 14%
  photography_video: 0.10,  // 10%
  clothing_jewelry: 0.08,   // 8%
  entertainment_music: 0.04,// 4%
  transport_logistics: 0.03,// 3%
  makeup_beauty: 0.025,     // 2.5%
  invitations_stationery: 0.015, // 1.5%
  gifts_favors: 0.02,       // 2%
  miscellaneous: 0.01,      // 1%
};

export const CATEGORY_LABELS: Record<ExpenseCategory, { name: string; icon: string; color: string; badgeBg: string }> = {
  venue: { name: 'Venue & Stay', icon: 'Building2', color: '#8b5cf6', badgeBg: 'bg-purple-100 text-purple-700' },
  food_catering: { name: 'Food & Catering', icon: 'UtensilsCrossed', color: '#f59e0b', badgeBg: 'bg-amber-100 text-amber-700' },
  decoration: { name: 'Decor & Floral', icon: 'Sparkles', color: '#ec4899', badgeBg: 'bg-pink-100 text-pink-700' },
  photography_video: { name: 'Photo & Cinematic', icon: 'Camera', color: '#3b82f6', badgeBg: 'bg-blue-100 text-blue-700' },
  clothing_jewelry: { name: 'Clothing & Bridal', icon: 'Crown', color: '#10b981', badgeBg: 'bg-emerald-100 text-emerald-700' },
  entertainment_music: { name: 'Entertainment & DJ', icon: 'Music', color: '#6366f1', badgeBg: 'bg-indigo-100 text-indigo-700' },
  transport_logistics: { name: 'Transport & Cars', icon: 'Car', color: '#14b8a6', badgeBg: 'bg-teal-100 text-teal-700' },
  makeup_beauty: { name: 'Makeup & Styling', icon: 'Wand2', color: '#f43f5e', badgeBg: 'bg-rose-100 text-rose-700' },
  invitations_stationery: { name: 'Invites & Stationery', icon: 'Mail', color: '#eab308', badgeBg: 'bg-yellow-100 text-yellow-800' },
  gifts_favors: { name: 'Gifts & Favors', icon: 'Gift', color: '#a855f7', badgeBg: 'bg-violet-100 text-violet-700' },
  miscellaneous: { name: 'Emergency & Misc', icon: 'CircleEllipsis', color: '#64748b', badgeBg: 'bg-slate-100 text-slate-700' },
};

/**
 * Calculates dynamic estimation weights based on user preferences and budget
 * If totalBudget is 0, ALL amounts return 0.
 */
export function calculateDynamicEstimates(params: WeddingParameters) {
  const baseBudget = params.totalBudget || 0;

  // If user hasn't entered their budget yet, all categories must strictly be 0!
  if (baseBudget <= 0) {
    return {
      venue: 0,
      food_catering: 0,
      decoration: 0,
      photography_video: 0,
      clothing_jewelry: 0,
      entertainment_music: 0,
      transport_logistics: 0,
      makeup_beauty: 0,
      invitations_stationery: 0,
      gifts_favors: 0,
      miscellaneous: 0,
      totalEstimated: 0,
    };
  }

  // Preference Multipliers
  let venueMult = 1.0;
  if (params.venueType === 'heritage_palace') venueMult = 1.25;
  else if (params.venueType === 'resort_destination') venueMult = 1.15;
  else if (params.venueType === 'beachfront') venueMult = 1.1;
  else if (params.venueType === 'community_hall') venueMult = 0.6;

  let decorMult = 1.0;
  if (params.decorStyle === 'royal_regal') decorMult = 1.25;
  else if (params.decorStyle === 'floral_extravaganza') decorMult = 1.2;
  else if (params.decorStyle === 'minimalist') decorMult = 0.7;

  let photoMult = 1.0;
  if (params.photographyStyle === 'celebrity_studio') photoMult = 1.3;
  else if (params.photographyStyle === 'drone_multi_team') photoMult = 1.15;
  else if (params.photographyStyle === 'standard') photoMult = 0.75;

  let clothesMult = 1.0;
  if (params.clothingStyle === 'designer_couture') clothesMult = 1.25;
  else if (params.clothingStyle === 'ready_to_wear') clothesMult = 0.7;

  // Proportional distribution that strictly adds up to user's totalBudget
  const venue = Math.round(baseBudget * CATEGORY_PERCENTAGES.venue * venueMult);
  const catering = Math.round(baseBudget * CATEGORY_PERCENTAGES.food_catering);
  const decor = Math.round(baseBudget * CATEGORY_PERCENTAGES.decoration * decorMult);
  const photo = Math.round(baseBudget * CATEGORY_PERCENTAGES.photography_video * photoMult);
  const clothing = Math.round(baseBudget * CATEGORY_PERCENTAGES.clothing_jewelry * clothesMult);
  const music = Math.round(baseBudget * CATEGORY_PERCENTAGES.entertainment_music);
  const transport = Math.round(baseBudget * CATEGORY_PERCENTAGES.transport_logistics);
  const makeup = Math.round(baseBudget * CATEGORY_PERCENTAGES.makeup_beauty);
  const invites = Math.round(baseBudget * CATEGORY_PERCENTAGES.invitations_stationery);
  const gifts = Math.round(baseBudget * CATEGORY_PERCENTAGES.gifts_favors);
  const misc = Math.round(baseBudget * CATEGORY_PERCENTAGES.miscellaneous);

  const rawSum = venue + catering + decor + photo + clothing + music + transport + makeup + invites + gifts + misc;

  // Normalize so the total strictly equals the user entered totalBudget
  const factor = rawSum > 0 ? baseBudget / rawSum : 1;

  const finalVenue = Math.round(venue * factor);
  const finalCatering = Math.round(catering * factor);
  const finalDecor = Math.round(decor * factor);
  const finalPhoto = Math.round(photo * factor);
  const finalClothing = Math.round(clothing * factor);
  const finalMusic = Math.round(music * factor);
  const finalTransport = Math.round(transport * factor);
  const finalMakeup = Math.round(makeup * factor);
  const finalInvites = Math.round(invites * factor);
  const finalGifts = Math.round(gifts * factor);
  const finalMisc = Math.max(0, baseBudget - (finalVenue + finalCatering + finalDecor + finalPhoto + finalClothing + finalMusic + finalTransport + finalMakeup + finalInvites + finalGifts));

  return {
    venue: finalVenue,
    food_catering: finalCatering,
    decoration: finalDecor,
    photography_video: finalPhoto,
    clothing_jewelry: finalClothing,
    entertainment_music: finalMusic,
    transport_logistics: finalTransport,
    makeup_beauty: finalMakeup,
    invitations_stationery: finalInvites,
    gifts_favors: finalGifts,
    miscellaneous: finalMisc,
    totalEstimated: baseBudget,
  };
}

/**
 * Intelligent rule-based and heuristics AI wedding planner advisor
 */
export function generateAISuggestions(
  params: WeddingParameters,
  expenses: ExpenseItem[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const budget = params.totalBudget || 0;

  if (budget <= 0) {
    return suggestions;
  }

  const totalPlanned = expenses.reduce((sum, item) => sum + item.actualCost, 0);
  const variance = totalPlanned - budget;

  // 1. Budget overrun alert or comfort check
  if (variance > 0) {
    suggestions.push({
      id: 'sug-overrun',
      type: 'risk_warning',
      title: `Budget Exceeded by ${params.currency}${variance.toLocaleString()}`,
      description: `Your committed actual costs currently exceed your planned budget of ${params.currency}${budget.toLocaleString()}. Immediate trim down recommended on decor and luxury rentals.`,
      actionableStep: 'Review high-ticket items in Venue and Decor where quotes can be renegotiated or consolidated.',
    });
  } else if (totalPlanned > 0 && variance < -budget * 0.15) {
    suggestions.push({
      id: 'sug-savings',
      type: 'saving_tip',
      title: `Healthy Surplus of ${params.currency}${Math.abs(variance).toLocaleString()}`,
      description: `Great financial planning! You are currently under budget by ${Math.round((Math.abs(variance) / budget) * 100)}%. We recommend keeping this as a last-minute liquid emergency buffer.`,
      potentialSavings: Math.abs(variance),
    });
  }

  // 2. Advance payment schedule warning
  const pendingBalances = expenses.filter((e) => e.actualCost - e.advancePaid > 0);
  const totalPending = pendingBalances.reduce((sum, e) => sum + (e.actualCost - e.advancePaid), 0);
  if (totalPending > 0) {
    suggestions.push({
      id: 'sug-cashflow',
      type: 'risk_warning',
      title: `Pending Vendor Payouts: ${params.currency}${totalPending.toLocaleString()}`,
      description: `${pendingBalances.length} vendors have outstanding balance settlements due near the wedding week. Ensure bank daily transfer limits are elevated 15 days in advance.`,
      actionableStep: 'Check bank RTGS limits and pre-schedule staggered payouts to prevent wedding-eve transaction blocks.',
    });
  }

  return suggestions;
}
