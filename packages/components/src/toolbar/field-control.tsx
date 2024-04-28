import { Col } from 'antd';
import { useEvent } from '@emiya-origin/hooks';
import clsx from 'clsx';
import { difference } from './utils';
import './field-control.less';

interface IFieldControlProps {
  children: React.ReactElement;
  onChange: (...args: any[]) => void;
  value?: any;
  name: string;
  label: string;
  wrapperClassName?: string;
}

export default function FieldControl({
  value,
  onChange,
  label,
  children,
  wrapperClassName,
}: IFieldControlProps) {
  const Component = children.type as React.JSXElementConstructor<any> & {
    defaultProps: any;
  };
  const handleFieldValueChange = useEvent((newValue: any, ...rest: any[]) => {
    onChange(newValue, ...rest);
  });
  return (
    <Col className={clsx('field-control-container', wrapperClassName)}>
      <div className="field-label">{label}:</div>
      <div className="field-control__wrapper">
        <Component
          {...difference(children.props, Component.defaultProps ?? {})}
          className={clsx('field-control', children.props.className)}
          value={value}
          onChange={handleFieldValueChange}
        />
      </div>
    </Col>
  );
}
