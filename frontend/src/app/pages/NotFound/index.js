import React from 'react';
import { setTitle } from 'app/hocs';

const NotFound = () => <div>Not Found!</div>;

export default setTitle(() => 'not found!')(NotFound);
