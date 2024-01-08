import html2canvas from "html2canvas";

export const toggleSort = (sortKey) => {
  setSortOrder((prevOrder) => {
    const newOrder = prevOrder === "desc" ? "asc" : "desc";
    // Sort the combinedKesmeCalculations array
    const sortedData = [...combinedKesmeCalculations].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (newOrder === "desc") {
        return aValue < bValue ? 1 : -1; // Assuming you want to sort by the first diameter
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    setCombinedKesmeCalculations(sortedData);
    return newOrder;
  });
};

import "react-tabs/style/react-tabs.css";

export const printTable = (setIsPrinting, tableId) => {
  setIsPrinting(true);

  // Function to change background color based on tableId
  const changeBackgroundColor = (color, tableId) => {
    let selector = "";
    if (
      tableId === "kesmeTable" ||
      tableId === "kesmeSeparateSumTable" ||
      tableId === "kesmeApplicationTable"
    ) {
      selector =
        "#kesmeTable tr, .bg-table-blue-first-line, .bg-table-blue-second-line, .bg-table-blue-third-line, .bg-table-green-first-line, .bg-table-green-second-line, .bg-table-green-third-line, .bg-red-500, .bg-red-200, .bg-red-100";
    } else if (tableId === "orderTable") {
      selector =
        "#orderTable tr, .bg-table-teal-first-line, .bg-table-teal-second-line, .bg-table-teal-third-line, .bg-table-blue-first-line, .bg-table-blue-second-line, .bg-table-blue-third-line, .bg-table-green-first-line, .bg-table-green-second-line, .bg-table-green-third-line, .bg-table-yellow-first-line, .bg-table-yellow-second-line, .bg-table-yellow-third-line, .bg-red-500, .bg-red-100";
    }
    document
      .querySelectorAll(selector)
      .forEach((el) => (el.style.backgroundColor = color));
  };

  // Remove background color before capturing
  changeBackgroundColor("transparent", tableId);

  setTimeout(() => {
    const table = document.getElementById(tableId);
    html2canvas(table).then((canvas) => {
      // Revert background color after capturing
      changeBackgroundColor("", tableId);

      const newWindow = window.open("", "_blank");

      // Add a style tag for landscape orientation
      const style = newWindow.document.createElement("style");
      style.textContent = `
        @media print {
          @page { size: landscape; }
        }
      `;
      newWindow.document.head.appendChild(style);

      newWindow.document.body.appendChild(canvas);
      newWindow.document.title =
        tableId === "kesmeTable"
          ? "KESME BİLGİLERİ TABLOSU"
          : "SİPARİŞ BİLGİLERİ TABLOSU";
      newWindow.print();
      newWindow.close();

      setIsPrinting(false);
    });
  }, 100);
};

/*

export function optimizeMeshProduction(orders) {
  const maxExtraLength = 40;

  // Sort orders by length in descending order
  orders.sort((a, b) => b[0] - a[0]);

  // Create an object for easier manipulation of quantities
  let orderDict = {};
  orders.forEach(order => {
      orderDict[order[0]] = order[1];
  });

  // Function to find exact combinations
  function findExactCombinations(target) {
      for (let length in orderDict) {
          length = parseInt(length);
          const quantity = orderDict[length];
          if (length < target && target % length === 0) {
              const neededQuantity = Math.floor(target / length);
              if (quantity >= neededQuantity) {
                  orderDict[length] -= neededQuantity;
                  return true;
              }
          }
      }
      return false;
  }

  // Function to find combinations within allowed extra length
  function findCombinationsWithinLimit(target) {
      for (let length in orderDict) {
          length = parseInt(length);
          let quantity = orderDict[length];
          if (length < target && quantity > 0) {
              let combinedLength = length;
              orderDict[length] -= 1;
              for (let addLength in orderDict) {
                  addLength = parseInt(addLength);
                  let addQuantity = orderDict[addLength];
                  if (addLength <= target - combinedLength && addQuantity > 0) {
                      if (target - (combinedLength + addLength) <= maxExtraLength) {
                          combinedLength += addLength;
                          orderDict[addLength] -= 1;
                          return true;
                      }
                  }
              }

              // Revert the changes if not suitable
              orderDict[length] += 1;
          }
      }
      return false;
  }

  // Optimize the production
  for (let length in orderDict) {
      length = parseInt(length);
      while (orderDict[length] > 0) {
          if (!findExactCombinations(length) && !findCombinationsWithinLimit(length)) {
              break;
          }
          orderDict[length] += 1;
      }
  }

  // Convert the object back to an array of tuples
  let optimizedOrders = Object.keys(orderDict).map(key => [parseInt(key), orderDict[key]]).filter(order => order[1] > 0);

  return optimizedOrders;
}

*/

export function optimizeMeshProduction(orders) {
  const maxExtraLength = 40;

  // Siparişleri uzunluklarına göre azalan sırada sırala
  orders.sort((a, b) => b[0] - a[0]);

  // Miktarları daha kolay yönetmek için bir nesne oluştur
  let orderDict = {};
  orders.forEach((order) => {
    orderDict[order[0]] = order[1];
  });

  // Orijinal siparişlerin toplam uzunluğunu hesapla
  let originalTotalLength = orders.reduce(
    (total, order) => total + order[0] * order[1],
    0
  );

  // Tam kombinasyonları bulan fonksiyon
  function findExactCombinations(target) {
    for (let length in orderDict) {
      length = parseInt(length);
      const quantity = orderDict[length];
      if (length < target && target % length === 0) {
        const neededQuantity = Math.floor(target / length);
        if (quantity >= neededQuantity) {
          orderDict[length] -= neededQuantity;
          return true;
        }
      }
    }
    return false;
  }

  // Belirli ekstra uzunluk aralıkları içinde kombinasyonları bulan fonksiyon
  function findCombinationsWithinRanges(target, minExtra, maxExtra) {
    for (let length in orderDict) {
      length = parseInt(length);
      let quantity = orderDict[length];
      if (length < target && quantity > 0) {
        let combinedLength = length;
        orderDict[length] -= 1;
        for (let addLength in orderDict) {
          addLength = parseInt(addLength);
          let addQuantity = orderDict[addLength];
          let extraLength = target - (combinedLength + addLength);
          if (
            addLength <= target - combinedLength &&
            addQuantity > 0 &&
            extraLength >= minExtra &&
            extraLength <= maxExtra
          ) {
            combinedLength += addLength;
            orderDict[addLength] -= 1;
            return true;
          }
        }
        orderDict[length] += 1; // Uygun olmayan durumlarda değişiklikleri geri al
      }
    }
    return false;
  }

  // Üretimi optimize et
  for (let length in orderDict) {
    length = parseInt(length);
    while (orderDict[length] > 0) {
      if (!findExactCombinations(length)) {
        let foundCombination = false;
        for (let range = 0; range < maxExtraLength; range += 10) {
          if (findCombinationsWithinRanges(length, range, range + 10)) {
            foundCombination = true;
            break;
          }
        }
        if (!foundCombination) {
          break;
        }
      }
      orderDict[length] += 1;
    }
  }

  // Nesneyi diziye çevir ve sipariş miktarı sıfırdan büyük olanları filtrele
  let optimizedOrders = Object.keys(orderDict)
    .map((key) => [parseInt(key), orderDict[key]])
    .filter((order) => order[1] > 0);

  // Optimize edilmiş siparişlerin toplam uzunluğunu hesapla
  let optimizedTotalLength = optimizedOrders.reduce(
    (total, order) => total + order[0] * order[1],
    0
  );

  // Fazladan kullanılan malzeme miktarını hesapla
  let extraLengthUsed = optimizedTotalLength - originalTotalLength;

  return { optimizedOrders, extraLengthUsed };
}


export function optimizeMeshProductionBasic(orders) {
  // Identify the order with the longest stick length
  const longestStickLength = Math.max(...orders.map(order => order[0]));

  // Initialize total sticks and extra length
  let totalSticks = 0;
  let extraLength = 0;

  for (const [length, quantity] of orders) {
      if (length === longestStickLength) {
          // Add the quantity directly if it's already the longest length
          totalSticks += quantity;
      } else {
          // Determine how many of the shorter sticks can be merged to approximate the longest stick
          const maxSticksToMerge = Math.floor(longestStickLength / length);
          const mergableSets = Math.floor(quantity / maxSticksToMerge);

          // Calculate how many longest sticks can be made from the shorter sticks
          const sticksFromShorter = mergableSets;
          totalSticks += sticksFromShorter;

          // Calculate the waste per merging
          const wastePerMerging = longestStickLength - (maxSticksToMerge * length);

          // Accumulate extra length (waste)
          extraLength += wastePerMerging * mergableSets;
      }
  }

  // The extra length is the accumulated waste from merging shorter sticks
  return {
      optimizedOrders: [[longestStickLength, totalSticks]],
      extraLengthUsed: extraLength
  };
}


export function optimizeMeshProductionBasicVersionTwo(orders) {
    console.log("optimizeMeshProductionBasicVersionTwo called with", orders);

    const originalLongestStickLength = Math.max(...orders.map((order) => order[0]));
    console.log("Original longest stick length:", originalLongestStickLength);

    let totalOrderLength = orders.reduce(
        (total, [length, quantity]) => total + length * quantity, 0
    );
    console.log("Total order length:", totalOrderLength);

    let totalSticks = orders.find((order) => order[0] === originalLongestStickLength)[1] || 0;
    let orderMap = new Map(orders);
    console.log("Initial order map:", orderMap);

    const minCombinationLength = Math.ceil(originalLongestStickLength / 2);

    function findAllCombinations(targetLength) {
        let combinations = [];
        let filteredOrders = Array.from(orderMap).filter(([length,]) => length !== originalLongestStickLength);
        for (let i = 0; i < filteredOrders.length; i++) {
            if (filteredOrders[i][1] > 0) {
                combinations = combinations.concat(
                    findCombinations(targetLength, [], i, filteredOrders)
                );
            }
        }
        let uniqueCombinations = Array.from(
            new Set(combinations.map(JSON.stringify))
        ).map(JSON.parse);
        return uniqueCombinations;
    }

    function findCombinations(targetLength, currentCombo = [], startIndex = 0, ordersSubset) {
        const sum = currentCombo.reduce((a, b) => a + b, 0);
        if (sum === targetLength) {
            return [currentCombo];
        }
        if (sum > targetLength) {
            return [];
        }

        let combinations = [];
        for (let i = startIndex; i < ordersSubset.length; i++) {
            const [length, quantity] = ordersSubset[i];
            if (quantity > 0 && length <= targetLength - sum) {
                ordersSubset[i][1]--;
                combinations = combinations.concat(
                    findCombinations(targetLength, currentCombo.concat(length), i, ordersSubset)
                );
                ordersSubset[i][1]++;
            }
        }
        return combinations;
    }

    function updateOrderMapWithCombination(combo) {
        combo.forEach((length) => {
            let currentQuantity = orderMap.get(length);
            orderMap.set(length, currentQuantity - 1);
        });
        let longestQuantity = orderMap.get(originalLongestStickLength) || 0;
        orderMap.set(originalLongestStickLength, longestQuantity + 1);
        totalSticks++;
    }

    for (let currentLength = originalLongestStickLength; currentLength >= minCombinationLength; currentLength--) {
        let combinations;
        do {
            combinations = findAllCombinations(currentLength);
            if (combinations.length > 0) {
                let selectedCombination = combinations[0];
                updateOrderMapWithCombination(selectedCombination);
            }
        } while (combinations.length > 0);
    }

    orderMap.forEach((quantity, length) => {
        if (length < originalLongestStickLength) {
            let combinedLength = 0;
            while (quantity > 0) {
                combinedLength += length;
                quantity--;
                if (combinedLength >= originalLongestStickLength) {
                    totalSticks++;
                    combinedLength = 0;
                }
            }
            if (combinedLength > 0 && combinedLength < originalLongestStickLength) {
                totalSticks++;
            }
        }
    });

    let extraLength = originalLongestStickLength * totalSticks - totalOrderLength;
    console.log("Extra length used:", extraLength);

    return {
        optimizedOrders: [[originalLongestStickLength, totalSticks]],
        extraLengthUsed: extraLength,
    };
}





