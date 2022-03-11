import { useField } from 'formik';
import { FormFeedback, FormGroup, Input, Label, InputProps } from 'reactstrap';

interface Props extends InputProps {
  label: string;
  name: string;
}

export function InputText(props: Props) {
  const { label, name, type, ...otherProps } = props;
  const [{ value, ...field }, meta] = useField(name);

  const invalid = meta.touched && meta.error;
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        type={type ?? 'text'}
        invalid={!!invalid}
        value={value ?? ''}
        {...field}
        {...otherProps}
      />
      {invalid && <FormFeedback>{meta.error}</FormFeedback>}
    </FormGroup>
  );
}