import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const RejectCampaignDialog = ({
  campaign,
  open,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Từ chối chiến dịch</DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do từ chối chiến dịch này
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='reason'>Lý do từ chối *</Label>
            <Textarea
              id='reason'
              placeholder='Nhập lý do cụ thể...'
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              rows={5}
              className='mt-1'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant='destructive' onClick={onConfirm}>
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
