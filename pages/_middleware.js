import { NextResponse, NextRequest } from "next/server";
const randomWords = require("random-words");

export async function middleware(req, ev) {
  const { pathname } = req.nextUrl;
  if (pathname == "/") {
    const newEvent = randomWords({ exactly: 3, join: "-" });
    const res = await fetch(`${process.env.APP_URL}/api/events/${newEvent}`, {
      method: "PUT",
      body: JSON.stringify({
        eventId: newEvent,
        eventName: "",
        startTime: Date.now().toString(),
        endTime: Date.now().toString(),
      }),
    });
    return NextResponse.redirect("/" + newEvent);
  }
  return NextResponse.next();
}
