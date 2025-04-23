
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { differenceInWeeks, addWeeks, format } from 'date-fns'
import '@fontsource/inter'
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'

function App() {
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [lifespan, setLifespan] = useState(90)
  
  const calculateWeeks = () => {
    if (!birthDate) return []
    
    const today = new Date()
    const totalWeeks = lifespan * 52
    const weeksLived = Math.max(0, differenceInWeeks(today, birthDate))
    
    return Array.from({ length: totalWeeks }, (_, i) => ({
      week: i,
      lived: i < weeksLived,
      isCurrent: i === weeksLived,
      isMilestone: [
        52 * 18, // 18 years
        52 * 21, // 21 years
        52 * 30, // 30 years
        52 * 40, // 40 years
        52 * 65, // 65 years
      ].includes(i),
    }))
  }

  const weeks = calculateWeeks()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-700">
          Life in Weeks
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select your birth date"
                maxDate={new Date()}
                showYearDropdown
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Expected Lifespan (years)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={lifespan}
                onChange={(e) => setLifespan(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {birthDate && (
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <div className="grid grid-cols-52 gap-1 min-w-[1040px]">
              {Array.from({ length: lifespan }).map((_, year) => (
                <div key={year} className="contents">
                  {weeks.slice(year * 52, (year + 1) * 52).map((week) => (
                    <div
                      key={week.week}
                      className={`
                        w-4 h-4 rounded-sm transition-all duration-300
                        ${week.lived ? 'bg-purple-600' : 'bg-gray-200'}
                        ${week.isCurrent ? 'ring-2 ring-teal-400' : ''}
                        ${week.isMilestone ? 'bg-teal-400' : ''}
                        hover:scale-150 hover:z-10
                      `}
                      title={`Week ${week.week + 1}: ${format(addWeeks(birthDate, week.week), 'MMM d, yyyy')}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App