import { FC, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import Box from '@mui/material/Box';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from '../ratingControlTester';
import AssetsTableRenderer from './AssetsTableRenderer';
import assetsTableTester from '../assetsTableTester';

import cartographie_result from '../cartographie.json';

const cartographie = cartographie_result.data[0].data;
const cartographie_schema = cartographie_result.data[0].schema;

const assetsSchema = {
  type: 'object',
  properties: {
    assets: cartographie_schema.properties.assets,
  },
  $defs: cartographie_schema.$defs,
};

const initialData = { assets: cartographie.assets };

const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: assetsTableTester, renderer: AssetsTableRenderer },
];

export const JsonFormsDemo: FC = () => {
  const [data, setData] = useState<object>(initialData);

  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <JsonForms
        schema={assetsSchema}
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
    </Box>
  );
};
