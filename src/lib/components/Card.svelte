<script lang="ts">
	import { Cross1, Pencil1, Plus } from 'radix-icons-svelte';
	import type { CardCrud, Task, TaskCrud } from '../../routes/+page.svelte';

	const defaultNewTaskForm = {
		title: ''
	};

	export let id: string;
	export let title: string;
	export let tasks: Task[];
	export let cardCrud: CardCrud;
	export let taskCrud: TaskCrud;

	const toggleCompleted = async (card_id: string, task_id: string) => {
		await taskCrud.edit({
			action: 'toggle_completed',
			context: { card_id, task_id }
		});
	};

	const addTask = (e: Event) => {
		e.preventDefault();
		// create
		taskCrud.create(id, newTaskForm.title);

		// reset
		newTaskForm = { ...defaultNewTaskForm };
	};

	let newTaskForm = { ...defaultNewTaskForm };
</script>

<div
	class="flex h-min flex-col gap-4 bg-bleu-gray px-3 pt-2 pb-4 rounded-md max-w-4xl min-w-[12.5rem] justify-start text-center"
>
	<h1 class="text-2xl font-medium">{title}</h1>
	{#each tasks as task}
		<div
			class="flex justify-between w-full bg-neutral-50 px-4 text-lg gap-12 rounded-md shadow-sm  font-medium"
		>
			<p
				class={`text-neutral-800 select-none cursor-pointer decoration-bleu-bg py-2 w-max pr-2 decoration-2 ${
					task.completed && 'line-through'
				}`}
				on:click={() => toggleCompleted(id, task.id)}
				on:keypress={() => toggleCompleted(id, task.id)}
			>
				{task.title}
			</p>
			<div class="flex gap-2 font-bold">
				<button
					class="text-neutral-800 hover:text-bleu-primary transition-all duration-100 ease-in-out"
				>
					<Pencil1 />
				</button>
				<button
					on:click={() => taskCrud.delete(id, task.id)}
					class="text-red-400 hover:text-red-700 transition-all duration-100 ease-in-out"
				>
					<Cross1 />
				</button>
			</div>
		</div>
	{/each}
	<form class="flex flex-col gap-4 mt-auto" on:submit={addTask}>
		<div class="flex gap-2 px-2 items-center justify-center">
			<input
				bind:value={newTaskForm.title}
				placeholder="Add Task"
				type="text"
				class="bg-transparent w-auto border-b border-bleu-primary text-lg px-2"
			/>
			<button
				class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent hover:text-bleu-primary hover:bg-bleu-dark transition-all duration-100 ease-in-out"
				disabled={newTaskForm.title.length <= 0}><Plus /></button
			>
		</div>
	</form>
	<button
		on:click={() => cardCrud.delete(id)}
		class="bg-transparent border-red-400 border self-center px-4 rounded-sm hover:bg-red-400 transition-all duration-100 ease-in-out"
		>Delete</button
	>
</div>
