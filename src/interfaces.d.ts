export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: number;
  isfc: string;
  accountType: string;
}

export interface UserRO {
  id: string;
  name: string;
  mobile: number;
  sponsoredBy: Pick<UserRO, 'id' | 'name'> | null;
  epinId: string | null;
  wallet: number;
  bankDetails: BankDetails | null;
  panNumber: string | null;
  roll: 'user' | 'admin';
  status: 'active' | 'inactive';
  activatedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  token?: string;
}

export interface UserDetailsRO {
  wallet: number;
  direct: number;
  downline: number;
  levelIncome: number;
  totalWithdrawal: number;
  totalIncome: number;
}

export interface MemberRO {
  id: string;
  name: string;
  mobile: number;
  level: number;
  status: 'active' | 'inactive';
  activatedAt: Date | null;
  createdAt: Date;
}

export interface EpinRO {
  id: string;
  owner: Pick<UserRO, 'id' | 'name'> | null;
  status: 'used' | 'unused';
  updatedAt: Date;
  createdAt: Date;
}

export interface IncomeRO {
  id: string;
  ownerId: string;
  from: Pick<UserRO, 'id' | 'name'>;
  level: number;
  amount: number;
  currentBalance: number;
  createdAt: Date;
}

export interface WithdrawalRO extends BankDetails {
  id: string;
  withdrawAmount: number;
  netAmount: number;
  processedAt: Date | null;
  paymentType: string;
  status: 'paid' | 'unpaid' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionRO {
  id: string;
  credit?: number;
  debit?: number;
  currentBalance: number;
  remarks: string;
  createdAt: Date;
}

export interface UserEPinRO {
  id: string;
  ePinId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EPinHistoryRO {
  id: string;
  ePinId: string;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RazorpayResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface AdminDashRO {
  totalMembers: number;
  activeMembers: number;
  activationIncome: number;
  epinIncome: number;
  totalWithdrawal: number;
  joinedToday: number;
  activatedToday: number;
  activationWeekly: number[];
  incomeWeekly: number[];
  withdrawalWeekly: number[];
}

export interface UserFilter {
  status?: 'active' | 'inactive' | 'all';
  wallet?: {
    min: number;
    max: number;
  };
}
