import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Tooltip,
  Chip,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';

interface RisqueJuridique {
  risk_name: string;
  recommendation: string;
}

interface AssetEnriched {
  id: string;
  name: string;
  keep?: boolean;
  identification: string;
  logiciel?: string | null;
  exploits?: string[];
  examples?: string[];
  description: string;
  originalite?: string | null;
  require_senior_review?: boolean;
  require_technical_review?: boolean;
  require_client_clarification?: boolean;
  risques_juridiques?: RisqueJuridique[];
}

interface AssetsTableProps {
  data: AssetEnriched[];
  handleChange(path: string, value: AssetEnriched[]): void;
  path: string;
}

type FilterMode = 'all' | 'keep' | 'review';

const HEADER_CELL_SX = { fontWeight: 700, whiteSpace: 'nowrap' as const };

const AssetsTableRenderer = ({
  data,
  handleChange,
  path,
}: AssetsTableProps) => {
  const [filter, setFilter] = useState<FilterMode>('all');

  const assets: AssetEnriched[] = data || [];

  const updateAsset = (
    index: number,
    field: keyof AssetEnriched,
    value: boolean,
  ) => {
    const updated = [...assets];
    updated[index] = { ...updated[index], [field]: value };
    handleChange(path, updated);
  };

  const needsReview = (a: AssetEnriched) =>
    a.require_senior_review ||
    a.require_technical_review ||
    a.require_client_clarification;

  const filtered = assets.filter(a => {
    if (filter === 'keep') return a.keep !== false;
    if (filter === 'review') return needsReview(a);
    return true;
  });

  const countKeep = assets.filter(a => a.keep !== false).length;
  const countReview = assets.filter(a => needsReview(a)).length;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          pt: 2,
          pb: 1,
          flexWrap: 'wrap',
        }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Assets
          <Chip label={assets.length} size="small" sx={{ ml: 1 }} />
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v && setFilter(v)}
          size="small">
          <ToggleButton value="all">Tous ({assets.length})</ToggleButton>
          <ToggleButton value="keep">
            <Box sx={{ color: 'success.main' }}>Conservés ({countKeep})</Box>
          </ToggleButton>
          <ToggleButton value="review">
            <Box sx={{ color: 'warning.main' }}>À relire ({countReview})</Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={HEADER_CELL_SX}>ID</TableCell>
              <TableCell sx={HEADER_CELL_SX}>Nom</TableCell>
              <TableCell sx={{ ...HEADER_CELL_SX, textAlign: 'center' }}>
                Keep
              </TableCell>
              <TableCell sx={HEADER_CELL_SX}>Logiciel</TableCell>
              <TableCell sx={HEADER_CELL_SX}>Identification</TableCell>
              <TableCell sx={{ ...HEADER_CELL_SX, textAlign: 'center' }}>
                <Tooltip title="Exemples">
                  <span>#Ex.</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={HEADER_CELL_SX}>Exploite</TableCell>
              <TableCell sx={{ ...HEADER_CELL_SX, textAlign: 'center' }}>
                <Tooltip title="Nécessite relecture senior">
                  <span>SR</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ ...HEADER_CELL_SX, textAlign: 'center' }}>
                <Tooltip title="Nécessite relecture technique">
                  <span>TR</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ ...HEADER_CELL_SX, textAlign: 'center' }}>
                <Tooltip title="Nécessite clarification client">
                  <span>CC</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ ...HEADER_CELL_SX, textAlign: 'center' }}>
                <Tooltip title="Risques juridiques">
                  <span>⚠ Risques</span>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map(asset => {
              const originalIndex = assets.indexOf(asset);
              const rowColor =
                asset.keep === false
                  ? 'action.hover'
                  : needsReview(asset)
                    ? 'warning.50'
                    : undefined;

              return (
                <TableRow
                  key={asset.id}
                  sx={{
                    bgcolor: rowColor,
                    opacity: asset.keep === false ? 0.55 : 1,
                    '&:hover': { bgcolor: 'action.selected' },
                  }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {asset.id}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 200 }}>
                    <Tooltip title={asset.description} placement="right" arrow>
                      <Typography variant="body2" noWrap>
                        {asset.name}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      checked={asset.keep !== false}
                      onChange={e =>
                        updateAsset(originalIndex, 'keep', e.target.checked)
                      }
                      size="small"
                      color="success"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {asset.logiciel ?? (
                        <span style={{ color: '#aaa' }}>—</span>
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 180 }}>
                    <Tooltip title={asset.identification} placement="top" arrow>
                      <Typography variant="body2" noWrap>
                        {asset.identification}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {asset.examples?.length ?? 0}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 120 }}>
                    <Typography variant="body2" noWrap>
                      {asset.exploits?.length ? (
                        asset.exploits.join(', ')
                      ) : (
                        <span style={{ color: '#aaa' }}>—</span>
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      checked={asset.require_senior_review ?? false}
                      onChange={e =>
                        updateAsset(
                          originalIndex,
                          'require_senior_review',
                          e.target.checked,
                        )
                      }
                      size="small"
                      color="warning"
                    />
                  </TableCell>

                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      checked={asset.require_technical_review ?? false}
                      onChange={e =>
                        updateAsset(
                          originalIndex,
                          'require_technical_review',
                          e.target.checked,
                        )
                      }
                      size="small"
                      color="warning"
                    />
                  </TableCell>

                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      checked={asset.require_client_clarification ?? false}
                      onChange={e =>
                        updateAsset(
                          originalIndex,
                          'require_client_clarification',
                          e.target.checked,
                        )
                      }
                      size="small"
                      color="warning"
                    />
                  </TableCell>

                  <TableCell align="center">
                    {(asset.risques_juridiques?.length ?? 0) > 0 ? (
                      <Tooltip
                        title={
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {asset.risques_juridiques!.map((r, i) => (
                              <li key={i}>{r.risk_name}</li>
                            ))}
                          </ul>
                        }
                        placement="left"
                        arrow>
                        <Chip
                          label={asset.risques_juridiques!.length}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        0
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const AssetsTableRendererWithJsonForms = withJsonFormsControlProps(
  AssetsTableRenderer as any,
);

export default AssetsTableRendererWithJsonForms;
