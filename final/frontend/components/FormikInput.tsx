import { useField } from 'formik';
import { FormFeedback, FormGroup, Input, Label, InputProps } from 'reactstrap';

interface Props extends InputProps {
  label: string;
  name: string;
}

export function FormikInput(props: Props) {
  const { label, name, type, options, ...otherProps } = props;
  const [{ value, ...field }, meta] = useField(name);

  const invalid = meta.touched && meta.error;
  return (
    <FormGroup floating>
      <Input
        type={type ?? 'text'}
        invalid={!!invalid}
        value={value ?? ''}
        placeholder={label}
        {...field}
        {...otherProps}
      />
      <Label>{label}</Label>
      {invalid && <FormFeedback>{meta.error}</FormFeedback>}
    </FormGroup>
  );
}