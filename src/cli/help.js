// @flow
// Implementation of `sourcecred help`.

import type {Command} from "./command";
import dedent from "../util/dedent";

import {help as loadHelp} from "./load";
import {help as scoresHelp} from "./scores";
import {help as outputHelp} from "./output";
import {help as clearHelp} from "./clear";
import {help as genProjectHelp} from "./genProject";
import {help as discourseHelp} from "./discourse";

const help: Command = async (args, std) => {
  if (args.length === 0) {
    usage(std.out);
    return 0;
  }
  const command = args[0];
  const subHelps: {[string]: Command} = {
    help: metaHelp,
    load: loadHelp,
    scores: scoresHelp,
    output: outputHelp,
    clear: clearHelp,
    "gen-project": genProjectHelp,
    discourse: discourseHelp,
  };
  if (subHelps[command] !== undefined) {
    return subHelps[command](args.slice(1), std);
  } else {
    usage(std.err);
    return 1;
  }
};

function usage(print: (string) => void): void {
  // TODO: Make the usage function pull its list of commands
  // from the sub-helps, to ensure that it is comprehensive
  print(
    dedent`\
    usage: sourcecred COMMAND [ARGS...]
           sourcecred [--version] [--help]

    Commands:
      load          load repository data into SourceCred
      clear         clear SoucrceCred data
      scores        print SourceCred scores to stdout
      output        print SourceCred data output to stdout
      gen-project   print a SourceCred project config to stdout
      discourse     load a Discourse server into SourceCred
      help          show this help message

    Use 'sourcecred help COMMAND' for help about an individual command.
    `.trimRight()
  );
}

const metaHelp: Command = async (args, std) => {
  if (args.length === 0) {
    std.out(
      dedent`\
      usage: sourcecred help [COMMAND]

      Use 'sourcecred help' for general help and a list of commands.
      Use 'sourcecred help COMMAND' for help about COMMAND.
      `.trimRight()
    );
    return 0;
  } else {
    usage(std.err);
    return 1;
  }
};

export default help;
