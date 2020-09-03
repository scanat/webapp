import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function BasicTextFields() {

  return (
    <form noValidate autoComplete="off">
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </form>
  );
}
