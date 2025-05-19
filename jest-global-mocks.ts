Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: jest.fn((key) => {
            const store: Record<string, string> = { myKey: 'mockValue' };
            return store[key] || null;
        }),
        setItem: jest.fn(),
    },
    writable: true,
});
