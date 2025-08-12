def quick_sort(arr):
    """
    快速排序（原地排序，返回同一列表引用）

    参数:
        arr: 需要排序的列表（元素需可比较）

    返回:
        已被原地排序后的同一列表对象
    """
    if arr is None:
        return arr
    if len(arr) < 2:
        return arr

    def partition_hoare(items, low, high):
        # 使用 Hoare 分区方案，通常交换次数更少
        pivot = items[(low + high) // 2]
        i = low - 1
        j = high + 1
        while True:
            i += 1
            while items[i] < pivot:
                i += 1
            j -= 1
            while items[j] > pivot:
                j -= 1
            if i >= j:
                return j
            items[i], items[j] = items[j], items[i]

    def quick_sort_recursive(items, low, high):
        if low < high:
            p = partition_hoare(items, low, high)
            quick_sort_recursive(items, low, p)
            quick_sort_recursive(items, p + 1, high)

    quick_sort_recursive(arr, 0, len(arr) - 1)
    return arr


def quick_sort_immutable(arr):
    """
    快速排序（返回新列表，不修改原列表）

    参数:
        arr: 需要排序的列表（元素需可比较）

    返回:
        新的已排序列表

    说明:
        使用简单的递归分治构建新列表，代码更直观，但会多占用内存。
    """
    if arr is None:
        return None
    n = len(arr)
    if n < 2:
        return arr.copy()

    pivot = arr[n // 2]
    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]
    return quick_sort_immutable(less) + equal + quick_sort_immutable(greater)


if __name__ == "__main__":
    # 简单演示
    samples = [
        [10, 7, 8, 9, 1, 5],
        [3, 6, 8, 10, 1, 2, 1],
        [],
        [1],
        [5, 5, 5, 5],
        [9, 8, 7, 6, 5, 4, 3],
    ]

    print("=== 快速排序（原地） ===")
    for i, arr in enumerate(samples, 1):
        arr_copy = arr.copy()
        quick_sort(arr_copy)
        print(f"示例 {i}: {arr} -> {arr_copy}")

    print("\n=== 快速排序（返回新列表） ===")
    for i, arr in enumerate(samples, 1):
        result = quick_sort_immutable(arr)
        print(f"示例 {i}: {arr} -> {result}")
