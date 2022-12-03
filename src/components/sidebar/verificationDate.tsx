import { useTranslation } from 'react-i18next';
import { mdiCalendar } from '@mdi/js';
import Icon from '@mdi/react'

export function CheckDateFormField() {
    const { t } = useTranslation();
    var curr = new Date();
    var date = curr.toISOString().substring(0,10);

    return (
        <div className="field">
        <label className="label has-text-weight-semibold">{t("sidebar.verification_date")}</label>
        <div className="control has-icons-left">
          <input className="input is-success py-0 datepicker-input"  type="date" defaultValue={date} placeholder={date} max={date} name="aedCheckDate" required pattern="\d{4}-\d{2}-\d{2}"/>
          <span className="icon is-small is-left is-flex is-justify-content-center">
             <Icon path={mdiCalendar} size={1} color='#dbdbdb' />
            </span>
        </div>
      </div>
    )
}