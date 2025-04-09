declare module "Configurator" {
  export const Configurator: React.FC<{
    priceLoading: boolean;
    configuratorLoading: boolean;
    totalPrice: number | null;
    initialData: any;
    data: any;
    saveDataAction: (data: any) => void;
    calculatePriceAction: (data: any) => void;
  }>;
}

declare module "Navigation" {
  export const Navigation: React.ForwardRefExoticComponent<
    {
      links: Array<{
        name: string;
        value: string;
        label: string;
        icon: string;
      }>;
    } & React.RefAttributes<any>
  >;
}

declare module "FE-utils" {
  export const DataTable: React.FC<{
    tableHeaderExtraActions?: React.ReactNode;
    tableHead: string[];
    tableBody: any[];
    shownElements: string[];
    tableActions?: (row: any) => React.ReactNode;
    onDataChange?: (value: any) => void;
    itemsPerPage?: number[];
    dataLoading?: boolean;
    totalItems?: number;
  }>;

  export const DataModal: React.FC<{
    showDataModal: boolean;
    hideDataModal: () => void;
    modalData: any;
    modalTitle: string;
    ModalAction: React.ReactNode;
    onModalSubmitData: (formData: any) => void;
  }>;

  export const DataCardSimple: React.FC<{
    cardData: {
      title: string;
      icon: string;
      iconBg: string;
      iconColor: string;
      value: string;
    };
  }>;

  export const DynamicForm: React.FC<{
    formData: any;
    submitData: (formData: any) => void;
    children?: React.ReactNode;
  }>;
}

declare module "web-authentication" {
  export const Login: React.FC<{
    loginUrl: string;
    cookiesAge: number;
    loginSuccess: (data: any) => void;
    apiUrl: string;
    getUserDataUrl: string;
    children?: React.ReactNode;
  }>;

  export function useLogout(apiUrl: string): () => Promise<void>;
  export function useAxiosPrivate(apiUrl: string, refreshUrl?: string): any;
}

declare module "web-appointment-calendar-component" {
  export const Meetings: React.FC<{
    selectedDateFromParent: Date | null;
    onDateChange: (date: Date | null) => void;
  }>;
}

// Add any missing types for other external modules here
