#!/bin/zsh
# The character's clips, in three lanes run side by side (the model works remotely; the Mac only waits).
# Loops start and end on the pose; reactions (--as) too, so either swaps in without a jump.
cd "${0:A:h}/.."
A() { node art/animate.mjs "$@" 2>&1 | tail -1; }
lane1() {
  A me-float "He drifts weightlessly through the sky: his arms sway slowly, his body turns a little and back, his hair and sweater ripple in the wind."
  A me-float "He does one slow, joyful somersault in the air, hair flying, and settles back into the same floating pose." --as me-float-flip
  A me-boat "He rows slowly: the oars dip and rise, the boat rocks gently on small waves, his hair moves in the sea wind."
  A me-boat "He lets go of one oar, turns his head to the viewer, smiles and waves, then takes the oar again and looks back at the horizon." --as me-boat-wave
  A me-boat "He stands up in the rocking boat and leaps off it in a clean dive, the boat sliding away out of the frame." --end me-dive --secs 4
}
lane2() {
  A me-kendo "The kendoka holds chudan no kamae, breathing calmly: the shinai tip moves slightly, he shifts his weight with tiny sliding steps, the hakama sways."
  A me-kendo "The kendoka strikes men: he lifts the shinai and drives forward with a stamp of the front foot, cutting straight down onto an invisible opponent's head, then returns to chudan no kamae." --as me-kendo-strike
  A me-record "He films the match with the phone, following the action: he turns slightly, taps the screen once, breathes calmly, his hair moves."
  A me-dive "He glides through the air in his dive, body stretched, hair streaming back, a slight arc."
}
lane3() {
  A me-scuba "The diver stops kicking, turns towards the viewer and waves, a ring of bubbles rises from his regulator, then he swims on in the same pose." --as me-scuba-wave
  A me-laptop "He types on the laptop, pauses to read the screen, nods slightly, types again, sitting on the stool, hair moving a little."
  A me-laptop "He looks up from the laptop at the viewer, smiles and gives a small wave, then goes back to typing." --as me-laptop-wave
  A me-hammock "The hammock sways gently from side to side, he turns a page of his book, the glowing sea fans sway slowly."
  A me-hammock "He lowers the book, looks at the viewer, smiles and waves lazily, then lifts the book again while the hammock sways." --as me-hammock-wave
}
lane1 & lane2 & lane3 & wait
