import { prisma } from "@lib/prisma";

export async function GET() {

	const scores = await prisma.score.findMany({
		include: { user: true, assignment: {
			include: {
				word: true
			}
		} },
	});

	if (!scores) {
		return new Response(JSON.stringify({ message: "Not Found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(scores), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
