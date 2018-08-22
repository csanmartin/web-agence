export class LineBarChartData {
    periods: Period[];
    meanFixedCost: number;
    consultants: Consultant[];
}

class Period {
    year: number;
    month: number;
}

class Consultant {
    userName: string;
    data: number[];
}
