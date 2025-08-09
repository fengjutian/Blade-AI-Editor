import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

import { useEffect } from 'react';

const calendarEle = () => {
  const initCalendar = () => {
    const calendar = new Calendar('#calendar', {
      defaultView: 'week',
      template: {
        time(event: any) {
          const { start, end, title } = event;

          return `<span style="color: white;">${(start)}~${(end)} ${title}</span>`;
        },
        allday(event: any) {
          return `<span style="color: gray;">${event.title}</span>`;
        },
      },
      calendars: [
        {
          id: 'cal1',
          name: 'Personal',
          backgroundColor: '#03bd9e',
        },
        {
          id: 'cal2',
          name: 'Work',
          backgroundColor: '#00a9ff',
        },
      ],
    });
  }

  useEffect(() => {
    initCalendar()
  }, [])

  return(
    <>
      <div id="calendar" style="height: 800px"></div>
    </>
  )

}

export default calendarEle;
