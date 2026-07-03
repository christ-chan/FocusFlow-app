import React, { useState, useEffect } from 'react';

// Main component for the FocusFlow App
export default function FocusFlowApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    } else if (timer === 0) {
        // Handle timer completion, e.g., play a sound
        clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">FocusFlow</h1>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-6xl font-mono mb-2">{formatTime(timer)}</div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`w-full px-4 py-2 text-lg font-semibold rounded-lg ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Task List</h2>
          <form onSubmit={handleAddTask} className="flex mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
              placeholder="Add a new task..."
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg">
              Add
            </button>
          </form>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg mb-2">
                <span>{task.text}</span>
                {/* Add functionality for completing/deleting tasks if needed */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
