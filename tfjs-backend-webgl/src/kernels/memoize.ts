import { murmurHash32 } from "./murmur3";

export function memoizedClass(target: any) {
    // save a reference to the original constructor
    var original = target;
    const cache = new Map<any, any>();

    // the new constructor behaviour
    var f: any = function (...args: any[]) {
        
        const combinedArgs = args.map(x => JSON.stringify(x)).join("|")
        const key = combinedArgs

        if (cache.has(key)) {
            return cache.get(key);
        }
        
        let result = new original(...args);
        result.cacheKey = result.userCode

        cache.set(key, result);

        return result;        
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor
    return f;
}


export function memoized(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;
    const cache = new Map<any, any>();

    descriptor.value = function (...args: any[]) { // we only support one argument

        const key = murmurHash32(args.join("|"), 89237)

        if (cache.has(key)) {
            return cache.get(key);
        }

        // call the original function
        var result = originalValue.apply(this, ...args);

        // cache the result
        cache.set(key, result);
        return result;
    }
}
