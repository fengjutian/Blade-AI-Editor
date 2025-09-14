'use client';

import { useEffect, useRef } from 'react';

const CalendarEle = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);

  useEffect(() => {
    const initCalendar = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Dynamic import to avoid SSR issues
        const [{ default: Calendar }] = await Promise.all([
          import('@toast-ui/calendar'),
          import('@toast-ui/calendar/dist/toastui-calendar.min.css')
        ]);

        if (calendarRef.current && !calendarInstance.current) {
          calendarInstance.current = new Calendar(calendarRef.current, {
            defaultView: 'week',
            template: {
              time(event: any) {
                const { start, end, title } = event;
                return `<span style="color: white;">${start}~${end} ${title}</span>`;
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
      } catch (error) {
        console.error('Failed to initialize calendar:', error);
      }
    };

    initCalendar();

    // Cleanup function
    return () => {
      if (calendarInstance.current) {
        try {
          calendarInstance.current.destroy();
        } catch (error) {
          console.error('Error destroying calendar:', error);
        }
        calendarInstance.current = null;
      }
    };
  }, []);

  return (
    <div ref={calendarRef} style={{ height: '800px' }} />
  );
};

export default CalendarEle;
