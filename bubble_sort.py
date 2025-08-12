def bubble_sort(arr):
    """
    冒泡排序算法实现
    
    参数:
        arr: 需要排序的列表
    
    返回:
        排序后的列表
    """
    n = len(arr)
    
    # 遍历所有数组元素
    for i in range(n):
        # 标记此轮是否发生交换
        swapped = False
        
        # 最后i个元素已经在正确位置，无需比较
        for j in range(0, n - i - 1):
            # 如果当前元素大于下一个元素，则交换它们
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # 如果没有发生交换，说明数组已经排序完成
        if not swapped:
            break
    
    return arr


def bubble_sort_optimized(arr):
    """
    优化版冒泡排序算法
    
    优化点：
    1. 记录最后一次交换的位置
    2. 下一轮只需要比较到该位置
    
    参数:
        arr: 需要排序的列表
    
    返回:
        排序后的列表
    """
    n = len(arr)
    last_swap = n - 1
    
    while last_swap > 0:
        current_swap = 0
        
        for j in range(last_swap):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                current_swap = j
        
        last_swap = current_swap
    
    return arr


def print_array(arr, message=""):
    """打印数组的辅助函数"""
    if message:
        print(f"{message}: {arr}")
    else:
        print(arr)


if __name__ == "__main__":
    # 测试用例
    test_cases = [
        [64, 34, 25, 12, 22, 11, 90],
        [5, 2, 4, 6, 1, 3],
        [1],
        [],
        [3, 3, 3, 3],
        [9, 8, 7, 6, 5, 4, 3, 2, 1]
    ]
    
    print("=== 冒泡排序算法演示 ===\n")
    
    for i, test_arr in enumerate(test_cases, 1):
        print(f"测试用例 {i}:")
        print_array(test_arr, "原始数组")
        
        # 创建副本进行排序
        arr_copy = test_arr.copy()
        sorted_arr = bubble_sort(arr_copy)
        print_array(sorted_arr, "排序后数组")
        
        print("-" * 40)
    
    print("\n=== 优化版冒泡排序演示 ===\n")
    
    # 测试优化版冒泡排序
    test_arr = [64, 34, 25, 12, 22, 11, 90]
    print_array(test_arr, "原始数组")
    
    arr_copy = test_arr.copy()
    sorted_arr = bubble_sort_optimized(arr_copy)
    print_array(sorted_arr, "优化版排序后数组")
    
    print("\n=== 性能对比 ===")
    import time
    import random
    
    # 生成大数组进行性能测试
    large_arr = [random.randint(1, 1000) for _ in range(1000)]
    
    # 测试标准冒泡排序
    arr1 = large_arr.copy()
    start_time = time.time()
    bubble_sort(arr1)
    standard_time = time.time() - start_time
    
    # 测试优化版冒泡排序
    arr2 = large_arr.copy()
    start_time = time.time()
    bubble_sort_optimized(arr2)
    optimized_time = time.time() - start_time
    
    print(f"标准冒泡排序耗时: {standard_time:.4f} 秒")
    print(f"优化版冒泡排序耗时: {optimized_time:.4f} 秒")
    print(f"性能提升: {((standard_time - optimized_time) / standard_time * 100):.2f}%")
