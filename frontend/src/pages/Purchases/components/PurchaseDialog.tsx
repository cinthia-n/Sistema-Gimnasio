import FormDialog from "../../../components/common/FormDialog";
import PurchaseForm from "./PurchaseForm";

interface Props {
  open: boolean;
  value: any;
  onChange: (value: any) => void;
  onClose: () => void;
  onSave: () => void;
  suppliers: any[];  
}

export default function PurchaseDialog({
  open,
  value,
  onChange,
  onClose,
  onSave,
  suppliers, 
}: Props) {

  return (

    <FormDialog
      open={open}
      title="Nueva compra"
      onClose={onClose}
      onSave={onSave}
    >

      <PurchaseForm
        value={value}
        onChange={onChange}
        suppliers={suppliers}        
      />

    </FormDialog>

  );

}