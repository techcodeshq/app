#!/bin/env python

import sys
import subprocess
import re
import os

if len(sys.argv) != 2: 
    print(f"USAGE: {sys.argv[0]} <backend>")
else:
    print("Running prisma generate...")
    frontend_dir = os.getcwd()
    os.chdir(sys.argv[1])
    subprocess.call(["yarn", "prisma", "generate"])
    os.chdir(frontend_dir)
    print("Copying generated file into ./src/types/...")
    target = "./src/types/index.ts"
    subprocess.call(["cp", sys.argv[1] + "/node_modules/.prisma/client/index.d.ts", target])
    print("Removing unnecessary code from file...")
    with open(target) as prisma_file:
        generated_prisma = prisma_file.read()
    code = ""
    for typedef in list(re.finditer(r"^export (type|const)", generated_prisma, re.MULTILINE))[1:]:
        if re.search(r"{", generated_prisma[typedef.start():]).start() < re.search(r"\n", generated_prisma[typedef.start():]).start():
            if "const" in typedef.group():
                code += generated_prisma[typedef.start():typedef.start() + re.search(r"^}", generated_prisma[typedef.start():], re.MULTILINE).start() + 1].replace("const", "enum").replace(":", "", 1).replace(":", " =")
            else:
                code += generated_prisma[typedef.start():typedef.start() + re.search(r"^}", generated_prisma[typedef.start():], re.MULTILINE).start() + 2]
    with open(target, "w") as types_file:
        types_file.write(code)
    print("Prettifying output...")
    subprocess.call(["yarn", "prettier", "--write", target])
