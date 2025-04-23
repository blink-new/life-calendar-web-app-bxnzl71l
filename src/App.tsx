
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { differenceInWeeks, addWeeks, format, isValid } from 'date-fns'
import { Dialog } from '@headlessui/react'
import '@fontsource/inter'
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'

interface Milestone {
  week: number
  description: string
}

const DEFAULT_MILESTONES: Milestone[] = [
  { week: 52 * 18, description: "18 years - Legal adult" },
  { week: 52 * 21, description: "21 years - Full adult rights" },
  { week: 52 * 30, description: "30 years - Career milestone" },
  { week: 52 * 40, description: "40 years - Mid-life reflection" },
  { week: 52 * 65, description: "65 years - Traditional retirement" },
]

function App() {
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [lifespan, setLifespan] = useState(90)
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('')
  const [isAddingByDate, setIsAddingByDate] = useState(false)
  const [milestoneDate, setMilestoneDate] = useState<Date | null>(null)
  
  const calculateWeeks = () => {
    if (!birthDate) return []
    
    const today = new Date()
    const totalWeeks = lifespan * 52
    const weeksLived = Math.max(0, differenceInWeeks(today, birthDate))
    
    return Array.from({ length: totalWeeks }, (_, i) => ({
      week: i,
      lived: i < weeksLived,
      isCurrent: i === weeksLived,
      milestone: milestones.find(m => m.week === i),
    }))
  }

  const handleWeekClick = (week: number) => {
    if (!birthDate) return
    setSelectedWeek(week)
    setIsAddingMilestone(true)
    setIsAddingByDate(false)
  }

  const addMilestone = () => {
    if (!newMilestoneDesc) return
    
    let weekNumber: number | null = null
    
    if (isAddingByDate && milestoneDate && birthDate && isValid(milestoneDate)) {
      weekNumber = differenceInWeeks(milestoneDate, birthDate)
    } else if (selectedWeek !== null) {
      weekNumber = selectedWeek
    }
    
    if (weekNumber === null) return
    
    setMilestones(prev => [...prev, { week: weekNumber!, description: newMilestoneDesc }])
    setNewMilestoneDesc('')
    setIsAddingMilestone(false)
    setSelectedWeek(null)
    setMilestoneDate(null)
    setIsAddingByDate(false)
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

            {birthDate && (
              <button
                onClick={() => {
                  setIsAddingMilestone(true)
                  setIsAddingByDate(true)
                  setSelectedWeek(null)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors mt-6"
              >
                Add Milestone by Date
              </button>
            )}
          </div>
        </div>

        {birthDate && (
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <p className="text-sm text-gray-600 mb-4">
              Click any week to add a custom milestone. Hover over colored squares to see milestone details.
            </p>
            <div className="flex">
              {/* Year markers */}
              <div className="flex flex-col pr-4 sticky left-0 z-10 bg-white">
                {Array.from({ length: lifespan }).map((_, year) => (
                  <div 
                    key={year} 
                    className="flex items-center justify-end"
                    style={{ 
                      height: '20px',
                      marginBottom: '4px'
                    }}
                  >
                    {year % 5 === 0 && (
                      <span className="text-sm font-medium text-gray-600 pr-2">
                        {year}y
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-52 gap-1 min-w-[1040px]">
                {Array.from({ length: lifespan }).map((_, year) => (
                  <div key={year} className="contents">
                    {weeks.slice(year * 52, (year + 1) * 52).map((week) => (
                      <div
                        key={week.week}
                        onClick={() => handleWeekClick(week.week)}
                        className={`
                          w-4 h-4 rounded-sm transition-all duration-300 cursor-pointer mb-1
                          ${week.lived ? 'bg-purple-600' : 'bg-gray-200'}
                          ${week.isCurrent ? 'ring-2 ring-teal-400' : ''}
                          ${week.milestone ? 'bg-teal-400' : ''}
                          hover:scale-150 hover:z-10 group relative
                        `}
                        title={`Week ${week.week + 1}: ${format(addWeeks(birthDate, week.week), 'MMM d, yyyy')}`}
                      >
                        {week.milestone && (
                          <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 -translate-y-full -translate-x-1/2 left-1/2 top-0 whitespace-nowrap z-20">
                            {week.milestone.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Dialog
          open={isAddingMilestone}
          onClose={() => {
            setIsAddingMilestone(false)
            setIsAddingByDate(false)
            setMilestoneDate(null)
            setNewMilestoneDesc('')
          }}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full">
              <Dialog.Title className="text-lg font-medium mb-4">
                Add Milestone
              </Dialog.Title>
              
              <div className="space-y-4">
                {isAddingByDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Milestone Date
                    </label>
                    <DatePicker
                      selected={milestoneDate}
                      onChange={(date) => setMilestoneDate(date)}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select milestone date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      showYearDropdown
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newMilestoneDesc}
                    onChange={(e) => setNewMilestoneDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter milestone description"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsAddingMilestone(false)
                      setIsAddingByDate(false)
                      setMilestoneDate(null)
                      setNewMilestoneDesc('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addMilestone}
                    disabled={(!isAddingByDate && selectedWeek === null) || 
                            (isAddingByDate && !milestoneDate) || 
                            !newMilestoneDesc}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
                  >
                    Add Milestone
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default App