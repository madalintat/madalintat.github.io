#!/bin/zsh
# The world's other living things: the whales, the opponent in the dojo, the lab's people walking in place (the page
# moves them across the floor), a jelly's pulse. Same rules as clips.sh: every clip starts and ends on its drawing.
cd "${0:A:h}/.."
A() { node art/animate.mjs "$@" 2>&1 | tail -1; }
W="The whale swims in place, seen side on: the tail fluke beats slowly up and down, the long flippers sweep gently, the body flexes along its length, a calm, heavy, graceful motion."
P="The person walks in place on the spot, like on a treadmill, a natural relaxed walk cycle seen exactly from the side: legs step, arms swing, head bobs a little. The figure does not move across the frame."
lane1() { A whale-doina "$W"; A whale-tudor "$W"; A whale-radu "$W"; A jelly "The jellyfish pulses: its bell contracts and relaxes slowly, the tentacles trail and sway, it rises a little and sinks back."; }
lane2() {
  A kendo-opponent "The kendoka in white holds chudan no kamae, breathing calmly: the shinai tip moves slightly, tiny sliding steps, the hakama sways."
  A kendo-opponent "The kendoka in white strikes kote: a quick small lift of the shinai and a sharp cut down to the left, a stamp of the front foot, then back to chudan no kamae." --as kendo-opponent-strike
  A person1 "$P"; }
lane3() { A person2 "$P"; A person3 "$P"; A person4 "$P"; A person5 "$P"; }
lane1 & lane2 & lane3 & wait
