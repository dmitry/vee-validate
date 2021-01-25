import flushPromises from 'flush-promises';
import { useField, useForm } from '@/vee-validate';
import { mountWithHoc } from './helpers';
import * as yup from 'yup';
import { doc } from 'prettier';

describe('useForm()', () => {
  const REQUIRED_MESSAGE = 'Field is required';

  test('sets individual field error message', async () => {
    mountWithHoc({
      setup() {
        const { setFieldError } = useForm();
        const { errorMessage } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          errorMessage,
          setFieldError,
        };
      },
      template: `
      <span>{{ errorMessage }}</span>
      <button @click="setFieldError('field', 'WRONG')">Set Field Error</button>
    `,
    });

    const error = document.querySelector('span');
    await flushPromises();
    expect(error?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(error?.textContent).toBe('WRONG');
  });

  test('sets multiple field error messages', async () => {
    mountWithHoc({
      setup() {
        const { setErrors } = useForm();
        const { errorMessage: err1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { errorMessage: err2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          err1,
          err2,
          setErrors,
        };
      },
      template: `
      <span>{{ err1 }}</span>
      <span>{{ err2 }}</span>
      <button @click="setErrors({ field1: 'WRONG', field2: 'WRONG AGAIN', field3: 'huh' })">Set Field Error</button>
    `,
    });

    const errors = document.querySelectorAll('span');
    await flushPromises();
    expect(errors[0]?.textContent).toBe('');
    expect(errors[1]?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(errors[0]?.textContent).toBe('WRONG');
    expect(errors[1]?.textContent).toBe('WRONG AGAIN');
  });

  test('sets multiple error messages per field', async () => {
    mountWithHoc({
      setup() {
        const { setErrors } = useForm();
        const { errorMessage: err1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));

        return {
          err1,
          setErrors,
        };
      },
      template: `
      <span>{{ err1 }}</span>
      <button @click="setErrors({ field1: ['WRONG', 'WRONG AGAIN'], field3: 'huh' })">Set Field Error</button>
    `,
    });

    const errors = document.querySelectorAll('span');
    await flushPromises();
    expect(errors[0]?.textContent).toBe('');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(errors[0]?.textContent).toBe(['WRONG', 'WRONG AGAIN']);
  });

  test('sets individual field dirty meta', async () => {
    mountWithHoc({
      setup() {
        const { setFieldDirty, meta: formMeta } = useForm();
        const { meta } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta,
          formMeta,
          setFieldDirty,
        };
      },
      template: `
      <span id="field">{{ meta.dirty }}</span>
      <span id="form">{{ formMeta.dirty }}</span>
      <button @click="setFieldDirty('field', true)">Set Meta</button>
    `,
    });

    const fieldMeta = document.querySelector('#field');
    const formMeta = document.querySelector('#form');
    await flushPromises();
    expect(fieldMeta?.textContent).toBe('false');
    expect(formMeta?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(fieldMeta?.textContent).toBe('true');
    expect(formMeta?.textContent).toBe('true');
  });

  test('sets multiple fields dirty meta', async () => {
    mountWithHoc({
      setup() {
        const { setDirty, meta: formMeta } = useForm();
        const { meta: meta1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { meta: meta2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta1,
          meta2,
          formMeta,
          setDirty,
        };
      },
      template: `
      <span>{{ meta1.dirty }}</span>
      <span>{{ meta2.dirty }}</span>
      <span>{{ formMeta.dirty }}</span>
      <button @click="setDirty({ field1: true, field2: false, field3: false })">Set Meta</button>
    `,
    });

    const meta = document.querySelectorAll('span');

    await flushPromises();
    expect(meta[0]?.textContent).toBe('false');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta[0]?.textContent).toBe('true');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('true');
  });

  test('sets individual field touched meta', async () => {
    mountWithHoc({
      setup() {
        const { setFieldTouched, meta: formMeta } = useForm();
        const { meta } = useField('field', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta,
          formMeta,
          setFieldTouched,
        };
      },
      template: `
      <span id="field">{{ meta.touched }}</span>
      <span id="form">{{ formMeta.touched }}</span>
      <button @click="setFieldTouched('field', true)">Set Meta</button>
    `,
    });

    const fieldMeta = document.querySelector('#field');
    const formMeta = document.querySelector('#form');
    await flushPromises();
    expect(fieldMeta?.textContent).toBe('false');
    expect(formMeta?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(fieldMeta?.textContent).toBe('true');
    expect(formMeta?.textContent).toBe('true');
  });

  test('sets multiple fields touched meta', async () => {
    mountWithHoc({
      setup() {
        const { setTouched, meta: formMeta } = useForm();
        const { meta: meta1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { meta: meta2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {
          meta1,
          meta2,
          formMeta,
          setTouched,
        };
      },
      template: `
      <span>{{ meta1.touched }}</span>
      <span>{{ meta2.touched }}</span>
      <span>{{ formMeta.touched }}</span>
      <button @click="setTouched({ field1: true, field2: false, field3: false })">Set Meta</button>
    `,
    });

    const meta = document.querySelectorAll('span');

    await flushPromises();
    expect(meta[0]?.textContent).toBe('false');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('false');
    document.querySelector('button')?.click();
    await flushPromises();
    expect(meta[0]?.textContent).toBe('true');
    expect(meta[1]?.textContent).toBe('false');
    expect(meta[2]?.textContent).toBe('true');
  });

  test('has a validate() method that returns an aggregate of validation results using field rules', async () => {
    let validate: any;
    mountWithHoc({
      setup() {
        const form = useForm();
        validate = form.validate;
        useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    const result = await validate();
    expect(result).toEqual({
      valid: false,
      errors: {
        field1: REQUIRED_MESSAGE,
        field2: REQUIRED_MESSAGE,
      },
    });
  });

  test('has a validate() method that returns an aggregate of validation results using validation schema', async () => {
    let validate: any;
    mountWithHoc({
      setup() {
        const form = useForm({
          validationSchema: yup.object({
            field1: yup.string().required(REQUIRED_MESSAGE),
            field2: yup.string().required(REQUIRED_MESSAGE),
          }),
        });

        validate = form.validate;
        useField('field1');
        useField('field2');

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    const result = await validate();
    expect(result).toEqual({
      valid: false,
      errors: {
        field1: REQUIRED_MESSAGE,
        field2: REQUIRED_MESSAGE,
      },
    });
  });

  test('has a validateField() method that validates a specific field', async () => {
    let validateField: any;
    mountWithHoc({
      setup() {
        const form = useForm();
        validateField = form.validateField;
        const { errorMessage: f1 } = useField('field1', val => (val ? true : REQUIRED_MESSAGE));
        const { errorMessage: f2 } = useField('field2', val => (val ? true : REQUIRED_MESSAGE));

        return { f1, f2 };
      },
      template: `<div>
        <span id="f1">{{ f1 }}</span>
        <span id="f2">{{ f2 }}</span>
      </div>`,
    });

    await flushPromises();
    const result = await validateField('field2');
    expect(result).toEqual({
      valid: false,
      errors: [REQUIRED_MESSAGE],
    });

    expect(document.querySelector('#f2')?.textContent).toBe(REQUIRED_MESSAGE);
    expect(document.querySelector('#f1')?.textContent).toBe('');
  });

  test('warns when validateField() is called on a non-existent field', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    let validateField: any;
    mountWithHoc({
      setup() {
        const form = useForm();
        validateField = form.validateField;

        return {};
      },
      template: `<div></div>`,
    });

    await flushPromises();
    const result = await validateField('field2');
    expect(result).toEqual({
      valid: true,
      errors: [],
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
