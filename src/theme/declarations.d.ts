import type { DataGridComponents } from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface Components extends DataGridComponents {}
}
