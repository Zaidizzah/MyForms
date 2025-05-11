{{--
    Modal application 
    /----------------/
    - Variables:
    -- modal_id: for modal id
    -- modal_title: for modal title
    -- modal_subtitle: for modal subtitle
    -- modal_body: for modal body
--}}
<div
class="modal fade"
tabindex="-1"
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"
aria-describedby="modal-subtitle"
>
<div class="modal-dialog">
    <div
        class="modal-title"
        id="modal-title"
    ></div>
    <div
        class="modal-subtitle"
        id="modal-subtitle"
    ></div>

    <div class="modal-body"></div>

    <div class="modal-footer">
        <button type="button" role="button" class="btn btn-cancel" data-dismiss="modal" aria-label="Close modal" data-tooltip="true" data-tooltip-title="Close modal">Batalkan</button>
        <button type="button" role="button" class="btn btn-primary" data-dismiss="modal" aria-label="Save changes" data-tooltip="true" data-tooltip-title="Save changes">Simpan</button>
    </div>
</div>
</div>