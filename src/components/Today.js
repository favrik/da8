import React, { useState, useCallback, useRef, useEffect } from 'react';
import addTaskMutation from '../graphql/AddTask';
import updateTaskMutation, { updateTaskCache } from '../graphql/UpdateTask';
import formatPlanData from '../lib/formatPlanData';
import TaskLevelSelector from './TaskLevelSelector';
import TaskDisplay from './TaskDisplay';
import KeyboardHelper from './KeyboardHelper';
import DA8, { itemNavigator } from '../lib/DA8';
import getPlan from '../graphql/GetPlan';

const Today = ({ initialPlan }) => {

  const input = useRef(null);
  const { ploading, pdata, perror } = getPlan('2021-01-17');

  const [tasks, setTasks] = useState([]);
  const [level, setLevel] = useState('a');
  const [selectedItem, setSelectedItem] = useState({ id: null });
  const [editing, setEditing] = useState(false);
  const [mutateTask, { data, loading, error }] = addTaskMutation();
  const [updateMutateTask, { udata, uloading, uerror }] = updateTaskMutation();

  const handleLevelChange = (event) => setLevel(event.target.value);

  const handleKeyboardShortcut = (event) => {
    const keyHelper = KeyboardHelper(event);

    if (keyHelper.f2()) {
      setEditing((previousEditing) => {
        const newEditing = !previousEditing;
        if (newEditing === false) {
          input.current.focus();
        }

        return newEditing;
      });
    }

    if (keyHelper.upDown()) {
      let task = selectedItem;

      if (selectedItem.id === null) {
        task = tasks[level][0];
      } else {
        const index = itemNavigator(tasks[level].map((item) => item.id), selectedItem.id, keyHelper.down());
        task = tasks[level][index];
      }

      setSelectedItem(task);
    }

    if (keyHelper.ctrlLeftRight()) {
      const levels = DA8.levels;
      setLevel(levels[ itemNavigator(levels, level, keyHelper.right()) ]);
      input.current.focus();
    }
  };

  const handleNewTaskInput = (event) => {
    const value = event.target.value;

    if (event.key === 'Enter') {
      addTask(event.target.value);
      event.target.value = '';
    }
  };

  const addTask = (description) => {
    if (validTask(description)) {
      const submittedTask = { description, level, plan_id: planId };
      //const newTask = { [level]: [...tasks[level], submittedTask] };

      mutateTask({ variables: submittedTask });

      //setTasks({ ...tasks, ...newTask });
    }
  };

  const validTask = (value) => value !== '';

  const handleEdit = (event) => {
    const description = event.target.value;

    if (event.key === 'Enter' && validTask(description)) {
      const submittedTask = { id: selectedItem.id, description, level, plan_id: planId };
      const newTask = { [level]: [...tasks[level], submittedTask] };

      updateMutateTask({ variables: submittedTask, update: updateTaskCache(submittedTask) });
      setTasks({ ...tasks, ...newTask });
      setEditing(!editing);
    }
  }

  console.log('render');

  if (ploading || loading) {
    return 'Loading';
  }
  if (perror || error || uerror || !pdata) {
    return 'ERROR';
  }

  const planId = pdata.plans[0].id;

  return (
    <div tabIndex="0" onKeyDown={handleKeyboardShortcut} style={{background: ''}}>
      <TaskLevelSelector handler={handleLevelChange} currentLevel={level} />

      <input ref={input} autoFocus={true} autoComplete="off" type="text" onKeyDown={handleNewTaskInput} name="todo" />

      <div className={"task-lists"}>
        <TaskDisplay tasks={tasks} selectedItem={selectedItem} editMode={editing} handleEdit={handleEdit} />
      </div>

      <style jsx>{`
        div:focus {
          border: 0 none;
          outline: 0 none;
        }
        input {
          border: 0 none;
          border-bottom: 1px solid #000;
          padding: .5rem;
          background: transparent;
          width: 30%;
        }

        .task-lists {
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: 1fr 1fr 1fr;
        }

      `}</style>
    </div>
  );
};

export default Today;
