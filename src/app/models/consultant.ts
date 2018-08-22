export class Consultant {
    userCode: string;
    userName: string;
    commercialData?: CommercialData;
    selected?: boolean;
}

class CommercialData {
    totalGains: number;
    totalFixedCosts: number;
    totalCommissions: number;
    totalProfits: number;
    years: Years[];
}

class Years {
    year: number;
    data?: Data[];
}

class Data {
    month: number;
    gain: number;
    fixedCost: number;
    commission: number;
    profit: number;
}

