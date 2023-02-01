import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import type { Card, Task } from '../../routes/+page.svelte';
import { z } from 'zod';

let cards: Card[] = [
	{
		id: '1',
		title: 'Card 1',
		tasks: [
			{
				id: '1',
				title: 'Task 1',
				cardId: '1',
				completed: false
			},
			{
				id: '2',
				title: 'Task 2',
				cardId: '1',
				completed: false
			},
			{
				id: '3',
				title: 'Task 3',
				cardId: '1',
				completed: false
			}
		]
	},
	{
		id: '2',
		title: 'Card 2',
		tasks: [
			{
				id: '4',
				title: 'Task 4',
				cardId: '2',
				completed: false
			},
			{
				id: '5',
				title: 'Task 5',
				cardId: '2',
				completed: false
			},
			{
				id: '6',
				title: 'Task 6',
				cardId: '2',
				completed: false
			}
		]
	},
	{
		id: '3',
		title: 'Card 3',
		tasks: [
			{
				id: '7',
				title: 'Task 7',
				cardId: '3',
				completed: false
			},
			{
				id: '8',
				title: 'Task 8',
				cardId: '3',
				completed: false
			},
			{
				id: '9',
				title: 'Task 9',
				cardId: '3',
				completed: false
			}
		]
	},
	{
		id: '4',
		title: 'Card 4',
		tasks: [
			{
				id: '10',
				title: 'Task 10',
				cardId: '4',
				completed: false
			},
			{
				id: '11',
				title: 'Task 11',
				cardId: '4',
				completed: false
			},
			{
				id: '12',
				title: 'Task 12',
				cardId: '4',
				completed: false
			}
		]
	}
];

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	greeting: t.procedure.query(async () => {
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	getCards: t.procedure.query(async () => {
		return cards;
	}),
	createCard: t.procedure.input(z.object({ title: z.string() })).mutation(async ({ input }) => {
		const newCard = {
			id: Date.now().toString(),
			title: input.title,
			tasks: []
		};

		cards = [newCard, ...cards];

		return newCard;
	}),
	deleteCard: t.procedure.input(z.object({ card_id: z.string() })).mutation(async ({ input }) => {
		const oldCardsLength = cards.length;
		cards = cards.filter((card) => card.id !== input.card_id);

		if (oldCardsLength === cards.length + 1) {
			return input.card_id;
		} else {
			return undefined;
		}
	}),
	createTask: t.procedure
		.input(z.object({ card_id: z.string(), title: z.string() }))
		.mutation(async ({ input }) => {
			let newCard;
			const newTask: Task = {
				cardId: input.card_id,
				id: Date.now().toString(),
				completed: false,
				title: input.title
			};

			cards = cards.map((card) => {
				if (card.id !== input.card_id) return card;

				newCard = {
					...card,
					tasks: [...card.tasks, newTask]
				};

				return newCard;
			});

			return newCard;
		}),
	editTaskTitle: t.procedure
		.input(z.object({ card_id: z.string(), task_id: z.string(), new_task_title: z.string() }))
		.mutation(async ({ input }) => {
			// edit stuff
			return undefined;
		}),
	editTaskCompleted: t.procedure
		.input(z.object({ card_id: z.string(), task_id: z.string() }))
		.mutation(async ({ input }) => {
			let newCard;
			cards = cards.map((card) => {
				if (card.id !== input.card_id) return card;

				newCard = {
					...card,
					tasks: card.tasks.map((task) => {
						if (task.id !== input.task_id) return task;

						return {
							...task,
							completed: !task.completed
						};
					})
				};
				return newCard;
			});

			return newCard;
		}),
	deleteTask: t.procedure
		.input(z.object({ card_id: z.string(), task_id: z.string() }))
		.mutation(async ({ input }) => {
			let newCard;
			cards = cards.map((card) => {
				if (card.id !== input.card_id) return card;

				newCard = {
					...card,
					tasks: card.tasks.filter((task) => task.id !== input.task_id)
				};

				return newCard;
			});

			return newCard;
		})
});

export type Router = typeof router;
