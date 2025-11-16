import { addDays, addYears, differenceInDays } from 'date-fns';
import type { Anniversary, AnniversaryResult } from '../../types/analysis/anniversary';

/**
 * 記念日のマイルストーン（日数）
 */
const DAY_MILESTONES = [
  { days: 7, label: '1週間' },
  { days: 30, label: '1ヶ月（30日）' },
  { days: 50, label: '50日' },
  { days: 100, label: '100日' },
  { days: 200, label: '200日' },
  { days: 300, label: '300日' },
  { days: 500, label: '500日' },
  { days: 1000, label: '1000日' },
  { days: 2000, label: '2000日' },
  { days: 3000, label: '3000日' },
  { days: 5000, label: '5000日' },
  { days: 10000, label: '10000日' },
];

/**
 * 記念日を計算
 * @param startDate 起点日（交際開始日、結婚記念日など）
 * @param targetDate 基準日（通常は今日）
 * @param yearsAhead 何年先まで計算するか
 * @returns 記念日情報
 */
export function calculateAnniversaries(
  startDate: Date,
  targetDate: Date = new Date(),
  yearsAhead: number = 10
): AnniversaryResult | null {
  try {
    if (!startDate || !targetDate) {
      return null;
    }

    const daysSinceStart = differenceInDays(targetDate, startDate);
    const anniversaries: Anniversary[] = [];

    // 日数記念日
    for (const milestone of DAY_MILESTONES) {
      const anniversaryDate = addDays(startDate, milestone.days);

      anniversaries.push({
        date: anniversaryDate,
        daysFromStart: milestone.days,
        description: `${milestone.label}記念日`,
        isSpecial: true,
      });
    }

    // 周年記念日
    for (let year = 1; year <= yearsAhead; year++) {
      const anniversaryDate = addYears(startDate, year);

      let yearLabel = '';
      if (year === 1) {
        yearLabel = '1周年';
      } else if (year === 5) {
        yearLabel = '5周年';
      } else if (year === 10) {
        yearLabel = '10周年';
      } else if (year === 20) {
        yearLabel = '20周年';
      } else if (year === 25) {
        yearLabel = '25周年（銀婚式）';
      } else if (year === 30) {
        yearLabel = '30周年（真珠婚式）';
      } else if (year === 50) {
        yearLabel = '50周年（金婚式）';
      } else {
        yearLabel = `${year}周年`;
      }

      anniversaries.push({
        date: anniversaryDate,
        daysFromStart: differenceInDays(anniversaryDate, startDate),
        description: yearLabel,
        isSpecial: year % 5 === 0 || year === 1 || year === 25 || year === 50,
      });
    }

    // 日付でソート
    anniversaries.sort((a, b) => a.date.getTime() - b.date.getTime());

    // 過去と未来の記念日に分ける
    const pastAnniversaries = anniversaries.filter(a => a.date < targetDate);
    const upcomingAnniversaries = anniversaries.filter(a => a.date >= targetDate);

    // 次のマイルストーン
    const nextMilestone = upcomingAnniversaries.find(a => a.isSpecial) || null;

    return {
      startDate,
      targetDate,
      daysSinceStart,
      upcomingAnniversaries: upcomingAnniversaries.slice(0, 10), // 最大10件
      pastAnniversaries: pastAnniversaries.slice(-10).reverse(), // 最新10件
      nextMilestone,
    };
  } catch (error) {
    console.error('Anniversary calculation failed:', error);
    return null;
  }
}

/**
 * 次の記念日までの日数を取得
 * @param startDate 起点日
 * @param targetDate 基準日
 * @returns 次の記念日までの日数
 */
export function getDaysToNextAnniversary(
  startDate: Date,
  targetDate: Date = new Date()
): number | null {
  const result = calculateAnniversaries(startDate, targetDate);
  if (!result || !result.nextMilestone) {
    return null;
  }

  return differenceInDays(result.nextMilestone.date, targetDate);
}
