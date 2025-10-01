export interface CommonTableProps<T, U> {
  pagination: {
    total: number;
    initial: number;
    perPage: number;
  };
  onChange: (params: { nextPage: number; is_spam?: boolean }) => Promise<T[]>;
  openRowPage: (form: T) => void;
  updateCb?: (
    id: string,
    data: U,
    notification?: import('@gofranz/common').NotificationConfig | { title: string; message: string }
  ) => Promise<void>;
  deleteCb: (id: string) => Promise<void>;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  headerActions?: React.ReactNode;
}
