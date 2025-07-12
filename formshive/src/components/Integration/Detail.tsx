import { HttpIntegration, HttpUpdateIntegration } from '../../lib/models';
import { EditIntegration } from './Edit';

export interface IntegrationDetailProps {
  integration: HttpIntegration;
  submitCb: (id: string, updateIntegration: HttpUpdateIntegration) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function IntegrationDetail(props: IntegrationDetailProps) {
  return (
    <>
      <EditIntegration integration={props.integration} submitFormCb={props.submitCb} />
    </>
  );
}
