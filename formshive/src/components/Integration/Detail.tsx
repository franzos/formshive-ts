import { Integration, UpdateIntegration } from '@gofranz/formshive-common';
import { EditIntegration } from './Edit';

export interface IntegrationDetailProps {
  integration: Integration;
  submitCb: (id: string, updateIntegration: UpdateIntegration) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function IntegrationDetail(props: IntegrationDetailProps) {
  return (
    <>
      <EditIntegration integration={props.integration} submitFormCb={props.submitCb} />
    </>
  );
}
