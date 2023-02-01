<script context="module" lang="ts">
	export type Task = {
		id: string;
		title: string;
		cardId: string;
		completed: boolean;
	};

	export type Card = {
		id: string;
		title: string;
		tasks: Task[];
	};

	type GenericEditOptions<T, K> = {
		action: T;
		context: K;
	};
	export type EditOptions =
		| GenericEditOptions<'toggle_completed', { card_id: string; task_id: string }>
		| GenericEditOptions<
				'edit_title',
				{ card_id: string; task_id: string; new_task_title: string }
		  >;

	type GenericReducerAction<T, K> = {
		type: T;
		payload: K;
	};

	type CardActions =
		| GenericReducerAction<'prepend', { new_card: Card }>
		| GenericReducerAction<'replace', { new_card: Card }>
		| GenericReducerAction<'reload', { cards: Card[] }>
		| GenericReducerAction<'delete', { card_id: string }>;

	export type CardCrud = {
		create: (title?: string) => Promise<void>;
		read: () => Promise<void>;
		delete: (card_id: string) => Promise<void>;
	};
	export type TaskCrud = {
		create: (card_id: string, title: string) => Promise<void>;
		edit: (options: EditOptions) => Promise<void>;
		delete: (card_id: string, task_id: string) => Promise<void>;
	};
</script>

<script lang="ts">
	import CardComponent from '$lib/components/Card.svelte';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import { Plus } from 'radix-icons-svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	// helpers
	const cards_reducer = (state: Card[], action: CardActions) => {
		switch (action.type) {
			case 'reload':
				return action.payload.cards;
			case 'prepend':
				return [action.payload.new_card, ...state];
			case 'replace':
				return state.map((card) => {
					if (card.id === action.payload.new_card.id) {
						return action.payload.new_card;
					}
					return card;
				});
			case 'delete':
				return state.filter((card) => card.id !== action.payload.card_id);
			default:
				return state;
		}
	};
	// Page State
	let cards: Card[] = [];
	let creatingCard = false;

	// CRUD
	const cardCrud: CardCrud = {
		read: async () => {
			const res = await trpc($page).getCards.query();

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'reload',
				payload: { cards: res }
			});
		},
		create: async (title = 'Untitled') => {
			creatingCard = true;

			const res = await trpc($page).createCard.mutate({ title });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'prepend',
				payload: { new_card: res }
			});
			creatingCard = false;
		},
		delete: async (card_id: string) => {
			const res = await trpc($page).deleteCard.mutate({ card_id });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'delete',
				payload: { card_id: res }
			});
		}
	};

	const taskCrud: TaskCrud = {
		create: async (card_id: string, title: string) => {
			const res = await trpc($page).createTask.mutate({ card_id, title });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		},
		edit: async (options: EditOptions) => {
			let res: Card | undefined;
			if (options.action === 'toggle_completed') {
				res = await trpc($page).editTaskCompleted.mutate(options.context);
			} else if (options.action === 'edit_title') {
				res = await trpc($page).editTaskTitle.mutate(options.context);
			}

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		},
		delete: async (card_id: string, task_id: string) => {
			const res = await trpc($page).deleteTask.mutate({ card_id, task_id });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		}
	};
	// Lifecycle
	$: console.log(cards);
</script>

<main class="w-full flex gap-8 flex-wrap">
	{#await cardCrud.read()}
		<Spinner />
	{:then}
		{#each cards as card (card.id)}
			<CardComponent {...{ ...card, taskCrud, cardCrud }} />
		{/each}
	{/await}
	<button
		on:click={() => cardCrud.create()}
		disabled={creatingCard}
		class="disabled:bg-neutral-500 text-4xl bg-bleu-primary h-min p-4 rounded-full my-4 hover:bg-[#3ecfff] transition-all duration-100 ease-in-out"
		><Plus class="h-5 w-5" /></button
	>
</main>
