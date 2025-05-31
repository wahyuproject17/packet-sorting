import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha, bgGradient } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  color?: ColorType;
  icon: React.ReactNode;
  status?: string;
};

export function AnalyticsWidgetSummary({
  icon,
  title,
  total,
  color = 'primary',
  status,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      {/* Badge Status */}
      {status && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 'bold',
            bgcolor:
              status.toLowerCase() === 'terisi'
                ? theme.palette.success.main
                : status.toLowerCase() === 'kosong'
                ? theme.palette.error.main
                : theme.palette.warning.main,
            color: 'common.white',
            textTransform: 'uppercase',
          }}
        >
          {status}
        </Box>
      )}

      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
          <Box sx={{ typography: 'h4' }}>{fShortenNumber(total)}</Box>
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
