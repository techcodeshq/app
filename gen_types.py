#!/bin/env python

import sys
import subprocess
import re

if len(sys.argv) != 2: 
    print(f"USAGE: {sys.argv[0]} <frontend>")
else:
    print("Running prisma generate...")
    subprocess.call(["yarn", "prisma", "generate"])
    print(f"Copying generated file into {sys.argv[1]}/src/types/...")
    target = sys.argv[1] + "/src/types/index.d.ts"
    subprocess.call(["cp", "node_modules/.prisma/client/index.d.ts", target])
    print("Removing unnecessary code from file...")
    with open(target) as prisma_file:
        generated_prisma = prisma_file.read()
    code = ""
    for typedef in list(re.finditer(r"^export (type|const)", generated_prisma, re.MULTILINE))[1:]:
        if re.search(r"{", generated_prisma[typedef.start():]).start() < re.search(r"\n", generated_prisma[typedef.start():]).start():
            code += generated_prisma[typedef.start():typedef.start() + re.search(r"^}", generated_prisma[typedef.start():], re.MULTILINE).start() + 2]
        else:
            code += generated_prisma[typedef.start():typedef.start() + re.search(r"\n", generated_prisma[typedef.start():]).start() + 1]
    with open(target, "w") as types_file:
        types_file.write(code)
