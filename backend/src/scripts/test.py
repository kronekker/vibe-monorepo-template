import sys
import json

def main():
    # The first argument is the script name, so args start from index 1
    args = sys.argv[1:]
    
    if not args:
        print("Hello from Python! No arguments were provided.")
        return
        
    print(f"Hello from Python! You provided the following arguments: {', '.join(args)}")

if __name__ == "__main__":
    main()
