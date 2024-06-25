import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const taskName = "Read a book";
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(new RegExp(taskName, "i"));
  expect(tasks).toHaveLength(1);
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addButton = screen.getByRole('button', {name: /Add/i});
  const taskName = "Task without due date";

  // Try to add a task without a due date
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.click(addButton);

  // Check if the task was not added
  const task = screen.queryByText(new RegExp(taskName, "i"));
  expect(task).toBeNull();
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const dueDate = "05/30/2023";

  // Try to add a task without a task name
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  // Check if the task was not added
  const task = screen.queryByText(new RegExp(dueDate, "i"));
  expect(task).toBeNull();
});

test('test that late tasks have different colors', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const dueDate = "01/01/2020"; // Past date
  const taskName = "History Test";

  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  const historyCheck = screen.getByText(/History Test/i).style.background;
  expect(historyCheck).not.toBe(""); // Assuming default or no color is ""
});

test('test that tasks can be deleted', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const taskName = "Task to be deleted";
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  const taskCheckbox = screen.getByRole('checkbox');
  fireEvent.click(taskCheckbox);

  const deleteButton = screen.getByRole('button', {name: /Delete/i});
  fireEvent.click(deleteButton);

  const task = screen.queryByText(new RegExp(taskName, "i"));
  expect(task).toBeNull();
});