import { RankData } from "src/interfaces";

export const levelIncomeAmount = {
    1: 30,
    2: 10,
    3: 5,
    4: 5,
    5: 4
};

export const Ranks: RankData[] = [
    {
        type: 'RANK1',
        direct: 1,
        company: 25,
        income: 80,
    },
    {
        type: 'RANK2',
        direct: 1,
        company: 75,
        income: 250,
    },
    {
        type: 'RANK3',
        direct: 1,
        company: 175,
        income: 700,
    },
    {
        type: 'RANK4',
        direct: 2,
        company: 425,
        income: 1000,
    },
    {
        type: 'RANK5',
        direct: 2,
        company: 925,
        income: 2500,
    },
    {
        type: 'RANK6',
        direct: 3,
        company: 1925,
        income: 3500,
    },
    {
        type: 'RANK7',
        direct: 4,
        company: 3925,
        income: 6500,
    },
    {
        type: 'RANK8',
        direct: 5,
        company: 7925,
        income: 9500,
    },
    {
        type: 'RANK9',
        direct: 8,
        company: 15925,
        income: 14500,
    },
    {
        type: 'RANK10',
        direct: 10,
        company: 30925,
        income: 17000,
    },
];