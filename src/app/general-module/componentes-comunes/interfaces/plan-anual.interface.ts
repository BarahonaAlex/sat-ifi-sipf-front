export interface Indicator {
    id: number;
    value: number;
}

export interface YearlyPlan {
    indicators: Indicator[];
    year: number;
}

export interface Goal {
    id: number;
    management: number;
    departament?: number;
    value: number;
}

export interface Month {
    goals?: Goal[];
    month?: number;
    plan?: number;
    type?: number;
}

export interface IndicatorDetail {
    indicator: number;
    name: string;
    value: number;
}

export interface MonthDetail extends Month {
    id?: number;
    typeName?: string;
    monthName?: string;
}

export interface YearlyPlanDetail {
    year: number;
    indicators: IndicatorDetail[];
    months: MonthDetail[];
    plan: number;
}

export interface MonthDelete {
	month: number;
	plan: number;
	type: number;
}